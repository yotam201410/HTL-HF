----------------------1------------------------------------
DROP TABLE IF EXISTS users cascade;
CREATE TABLE users(user_id INTEGER, action TEXT, date DATE);
INSERT INTO users (user_id, "action", "date")
VALUES (1, 'start', CAST('01-01-20' AS date)),
    (1, 'cancel', CAST('01-02-20' AS date)),
    (2, 'start', CAST('01-03-20' AS date)),
    (2, 'publish', CAST('01-04-20' AS date)),
    (3, 'start', CAST('01-05-20' AS date)),
    (3, 'cancel', CAST('01-06-20' AS date)),
    (1, 'start', CAST('01-07-20' AS date)),
    (1, 'publish', CAST('01-08-20' AS date));
SELECT user_id,
    cast(
        (
            select count(*)
            from users
            where users.user_id = u.user_id
                AND action = 'publish'
        ) as real
    ) / count(*) as publish_rate,
    cast(
        (
            select count(*)
            from users
            where users.user_id = u.user_id
                AND action = 'cancel'
        ) as real
    ) / count(*) as cancel_rate
FROM users as u
GROUP BY user_id;
----------------------------2------------------------------
DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions(
    sender integer,
    receiver integer,
    amount integer,
    transaction_date date
);
INSERT INTO transactions (sender, receiver, amount, transaction_date)
VALUES (5, 2, 10, CAST('12-2-20' AS date)),
    (1, 3, 15, CAST('13-2-20' AS date)),
    (2, 1, 20, CAST('13-2-20' AS date)),
    (2, 3, 25, CAST('14-2-20' AS date)),
    (3, 1, 20, CAST('15-2-20' AS date)),
    (3, 2, 15, CAST('15-2-20' AS date)),
    (1, 4, 5, CAST('16-2-20' AS date));
SELECT user_id
from (
        select DISTINCT user_id
        FROM (
                SELECT sender AS user_id
                FROM transactions
                UNION
                SELECT receiver AS user_id
                FROM transactions
            ) AS all_users
    );
-------------------3-----------------------
DROP TABLE IF exists items;
CREATE TABLE ITEMS(date date, item text);
INSERT INTO items ("date", item)
VALUES (CAST('01-01-20' AS date), 'apple'),
    (CAST('01-01-20' AS date), 'apple'),
    (CAST('01-01-20' AS date), 'pear'),
    (CAST('01-01-20' AS date), 'pear'),
    (CAST('01-02-20' AS date), 'pear'),
    (CAST('01-02-20' AS date), 'pear'),
    (CAST('01-02-20' AS date), 'pear'),
    (CAST('01-02-20' AS date), 'orange');
SELECT DISTINCT i."date",
    i.item
FROM items i
    JOIN (
        SELECT "date",
            item,
            COUNT(*) AS item_count
        FROM items
        GROUP BY "date",
            item
    ) AS ic ON i."date" = ic."date"
    AND i.item = ic.item
    JOIN (
        SELECT "date",
            MAX(item_count) AS max_count
        FROM (
                SELECT "date",
                    item,
                    COUNT(*) AS item_count
                FROM items
                GROUP BY "date",
                    item
            ) AS sub
        GROUP BY "date"
    ) AS max_counts ON ic."date" = max_counts."date"
    AND ic.item_count = max_counts.max_count
ORDER BY i."date",
    i.item;
---------------------------4---------------------------
---------------------------5----------------------------
drop table if exists users;
create table users(
    user_id integer,
    product_id integer,
    transaction_date date
);
INSERT INTO users (user_id, product_id, transaction_date)
VALUES (1, 101, CAST('12-2-20' AS date)),
    (2, 105, CAST('13-2-20' AS date)),
    (1, 111, CAST('14-2-20' AS date)),
    (3, 121, CAST('15-2-20' AS date)),
    (1, 101, CAST('16-2-20' AS date)),
    (2, 105, CAST('17-2-20' AS date)),
    (4, 101, CAST('16-2-20' AS date)),
    (3, 105, CAST('15-2-20' AS date));
select user_id,
    (
        CASE
            WHEN COUNT(*) >= 2 THEN (
                SELECT transaction_date
                FROM users u2
                WHERE u2.user_id = u1.user_id
                ORDER BY transaction_date
                LIMIT 1 OFFSET 1
            )
            ELSE NULL
        END
    ) AS second_transaction_date
from users as u1
group by user_id
order by second_transaction_date;
------------------------------6----------------------------------------
DROP TABLE IF EXISTS FRIENDS CASCADE;
DROP TABLE IF EXISTS LIKES CASCADE;
CREATE TABLE FRIENDS(USER_ID INTEGER, FRIEND INTEGER);
CREATE TABLE LIKES(user_id INTEGER, page_likes CHAR);
INSERT INTO friends (user_id, friend)
VALUES (1, 2),
    (1, 3),
    (1, 4),
    (2, 1),
    (3, 1),
    (3, 4),
    (4, 1),
    (4, 3);
INSERT INTO likes (user_id, page_likes)
VALUES (1, 'A'),
    (1, 'B'),
    (1, 'C'),
    (2, 'A'),
    (3, 'B'),
    (3, 'C'),
    (4, 'B');
SELECT DISTINCT FRIENDS.USER_ID,
    PAGE_LIKES AS RECOMMENDED_PAGE
FROM FRIENDS
    INNER JOIN LIKES ON LIKES.USER_ID = FRIENDS.FRIEND
WHERE LIKES.PAGE_LIKES NOT IN (
        SELECT PAGE_LIKES
        FROM LIKES
        WHERE LIKES.USER_ID = FRIENDS.USER_ID
    )
ORDER BY FRIENDS.USER_ID;
------------------------7--------------------------------
DROP TABLE IF EXISTS MOBILE;
DROP TABLE IF EXISTS WEB;
CREATE TABLE MOBILE(USER_ID INTEGER, PAGE_URL CHAR);
CREATE TABLE WEB(USER_ID INTEGER, PAGE_URL CHAR);
INSERT INTO mobile (user_id, page_url)
VALUES (1, 'A'),
    (2, 'B'),
    (3, 'C'),
    (4, 'A'),
    (9, 'B'),
    (2, 'C'),
    (10, 'B');
INSERT INTO web (user_id, page_url)
VALUES (6, 'A'),
    (2, 'B'),
    (3, 'C'),
    (7, 'A'),
    (4, 'B'),
    (8, 'C'),
    (5, 'B');
WITH ALL_USERS AS (
    SELECT USER_ID
    FROM MOBILE
    UNION
    SELECT USER_ID
    FROM WEB
),
MOBILE_USERS AS(
    SELECT USER_ID
    FROM MOBILE
),
WEB_USERS AS(
    SELECT USER_ID
    FROM WEB
)
SELECT (
        CAST(
            (
                SELECT COUNT(*)
                FROM MOBILE
                WHERE MOBILE.USER_ID NOT IN (
                        SELECT USER_ID
                        FROM WEB_USERS
                    )
            ) AS REAL
        ) / COUNT(*)
    ) AS MOBILE_USAGE,
    (
        CAST(
            (
                SELECT COUNT(*)
                FROM WEB
                WHERE WEB.USER_ID NOT IN (
                        SELECT USER_ID
                        FROM MOBILE_USERS
                    )
            ) AS REAL
        ) / COUNT(*)
    ) AS WEB_USAGE,
    (
        CAST(
            (
                SELECT COUNT(*)
                FROM WEB
                WHERE WEB.USER_ID IN (
                        SELECT USER_ID
                        FROM MOBILE_USERS
                    )
            ) AS REAL
        ) / COUNT(*)
    ) AS BOTH_USAGE
FROM ALL_USERS;
------------------------------8------------------------------------
SET datestyle to SQL,
    MDY;
DROP TABLE IF EXISTS USERS;
DROP TABLE IF EXISTS EVENTS;
CREATE TABLE USERS(
    USER_ID INTEGER,
    NAME TEXT,
    JOIN_DATE DATE
);
CREATE TABLE EVENTS(
    USER_ID INTEGER,
    TYPE TEXT,
    ACCESS_DATE DATE
);
INSERT INTO users (user_id, name, join_date)
VALUES (1, 'Jon', CAST('2-14-20' AS date)),
    (2, 'Jane', CAST('2-14-20' AS date)),
    (3, 'Jill', CAST('2-15-20' AS date)),
    (4, 'Josh', CAST('2-15-20' AS date)),
    (5, 'Jean', CAST('2-16-20' AS date)),
    (6, 'Justin', CAST('2-17-20' AS date)),
    (7, 'Jeremy', CAST('2-18-20' AS date));
SELECT *
FROM USERS;
INSERT INTO events (user_id, type, access_date)
VALUES (1, 'F1', CAST('3-1-20' AS date)),
    (2, 'F2', CAST('3-2-20' AS date)),
    (2, 'P', CAST('3-12-20' AS date)),
    (3, 'F2', CAST('3-15-20' AS date)),
    (4, 'F2', CAST('3-15-20' AS date)),
    (1, 'P', CAST('3-16-20' AS date)),
    (3, 'P', CAST('3-22-20' AS date));
SET datestyle to SQL,
    DMY;
WITH UPGRATED_USERS AS(
    SELECT USERS.USER_ID,
        USERS.JOIN_DATE,
        EVENTS.ACCESS_DATE
    FROM USERS
        INNER JOIN EVENTS ON USERS.USER_ID = EVENTS.USER_ID
    WHERE EVENTS.TYPE = 'F2'
)
SELECT CAST(
        CAST(COUNT(*) AS REAL) /(
            SELECT COUNT(*)
            FROM UPGRATED_USERS
        ) AS NUMERIC(3, 2)
    ) AS UPGRADE_RATE
FROM UPGRATED_USERS
WHERE ACCESS_DATE - JOIN_DATE < 30;
-----------------------9------------------------------------------
DROP TABLE IF EXISTS FRIENDS;
CREATE TABLE FRIENDS(USER1 INTEGER, USER2 INTEGER);
INSERT INTO friends (user1, user2)
VALUES (1, 2),
    (1, 3),
    (1, 4),
    (2, 3);
WITH USERS AS (
    SELECT USER1
    FROM friends
    UNION
    SELECT USER2
    FROM FRIENDS
)
SELECT U1.USER1 AS USER_ID,
    (
        SELECT COUNT(*)
        FROM FRIENDS
        WHERE FRIENDS.USER1 = U1.USER1
    ) + (
        SELECT COUNT(*)
        FROM FRIENDS
        WHERE FRIENDS.USER2 = U1.USER1
    ) AS FRIENDS
FROM USERS U1
ORDER BY U1.USER1;
--------------------------------10------------------------------------------
DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
    task_id INTEGER,
    start_date DATE,
    end_date DATE
);
INSERT INTO projects (task_id, start_date, end_date)
VALUES (
        1,
        CAST('2020-10-01' AS DATE),
        CAST('2020-10-02' AS DATE)
    ),
    (
        2,
        CAST('2020-10-02' AS DATE),
        CAST('2020-10-03' AS DATE)
    ),
    (
        3,
        CAST('2020-10-03' AS DATE),
        CAST('2020-10-04' AS DATE)
    ),
    (
        4,
        CAST('2020-10-13' AS DATE),
        CAST('2020-10-14' AS DATE)
    ),
    (
        5,
        CAST('2020-10-14' AS DATE),
        CAST('2020-10-15' AS DATE)
    ),
    (
        6,
        CAST('2020-10-28' AS DATE),
        CAST('2020-10-29' AS DATE)
    ),
    (
        7,
        CAST('2020-10-30' AS DATE),
        CAST('2020-10-31' AS DATE)
    );
WITH ProjectGroups AS (
    SELECT task_id,
        start_date,
        end_date,
        CASE
            WHEN start_date = LAG(end_date) OVER (
                ORDER BY start_date
            ) THEN 0
            ELSE 1
        END AS new_project_flag
    FROM projects
),
GroupedProjects AS (
    SELECT task_id,
        start_date,
        end_date,
        SUM(new_project_flag) OVER (
            ORDER BY start_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS project_id
    FROM ProjectGroups
),
ProjectDurations AS (
    SELECT project_id,
        MIN(start_date) AS project_start_date,
        MAX(end_date) AS project_end_date,
        COUNT(*) AS number_of_days
    FROM GroupedProjects
    GROUP BY project_id
)
SELECT project_start_date,
    project_end_date,
    number_of_days
FROM ProjectDurations
ORDER BY number_of_days ASC,
    project_start_date DESC;
--------------------------------11--------------------------------------
DROP TABLE IF EXISTS ATTENDANCE;
DROP TABLE IF EXISTS STUDENTS;
CREATE TABLE ATTENDANCE(
    STUDENT_ID INTEGER,
    SCHOOL_DATE DATE,
    ATTENDANCE INTEGER
);
CREATE TABLE STUDENTS(
    STUDENT_ID INTEGER,
    SCHOOL_ID INTEGER,
    GRADE_LEVEL INTEGER,
    DATE_OF_BIRTH DATE
);
INSERT INTO attendance (student_id, school_date, attendance)
VALUES (1, CAST('2020-04-03' AS date), 0),
    (2, CAST('2020-04-03' AS date), 1),
    (3, CAST('2020-04-03' AS date), 1),
    (1, CAST('2020-04-04' AS date), 1),
    (2, CAST('2020-04-04' AS date), 1),
    (3, CAST('2020-04-04' AS date), 1),
    (1, CAST('2020-04-05' AS date), 0),
    (2, CAST('2020-04-05' AS date), 1),
    (3, CAST('2020-04-05' AS date), 1),
    (4, CAST('2020-04-05' AS date), 1);
INSERT INTO students (
        student_id,
        school_id,
        grade_level,
        date_of_birth
    )
VALUES (1, 2, 5, CAST('2012-04-03' AS date)),
    (2, 1, 4, CAST('2013-04-04' AS date)),
    (3, 1, 3, CAST('2014-04-05' AS date)),
    (4, 2, 4, CAST('2013-04-03' AS date));
SELECT CAST(
        CAST(COUNT(*) AS REAL) / (
            SELECT COUNT(*)
            FROM STUDENTS
        ) AS NUMERIC(3, 2)
    )
FROM STUDENTS
    INNER JOIN ATTENDANCE ON students.student_id = ATTENDANCE.student_id
WHERE ATTENDANCE.ATTENDANCE = 1
    AND DATE_PART('DAY', ATTENDANCE.SCHOOL_DATE) = DATE_PART('DAY', STUDENTS.DATE_OF_BIRTH)
    AND DATE_PART('MONTH', ATTENDANCE.SCHOOL_DATE) = DATE_PART('MONTH', STUDENTS.DATE_OF_BIRTH)

---------------------------12---------------------------------------------------
