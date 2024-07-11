----------------------1------------------------------------
DROP TABLE IF EXISTS users cascade;

CREATE TABLE users (user_id INTEGER, action TEXT, date DATE);

INSERT INTO
    users (user_id, "action", "date")
VALUES
    (1, 'start', CAST('01-01-20' AS date)),
    (1, 'cancel', CAST('01-02-20' AS date)),
    (2, 'start', CAST('01-03-20' AS date)),
    (2, 'publish', CAST('01-04-20' AS date)),
    (3, 'start', CAST('01-05-20' AS date)),
    (3, 'cancel', CAST('01-06-20' AS date)),
    (1, 'start', CAST('01-07-20' AS date)),
    (1, 'publish', CAST('01-08-20' AS date));

SELECT
    user_id,
    cast(
        (
            select
                count(*)
            from
                users
            where
                users.user_id = u.user_id
                AND action = 'publish'
        ) as real
    ) / count(*) as publish_rate,
    cast(
        (
            select
                count(*)
            from
                users
            where
                users.user_id = u.user_id
                AND action = 'cancel'
        ) as real
    ) / count(*) as cancel_rate
FROM
    users as u
GROUP BY
    user_id;

----------------------------2------------------------------
DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions (
    sender integer,
    receiver integer,
    amount integer,
    transaction_date date
);

INSERT INTO
    transactions (sender, receiver, amount, transaction_date)
VALUES
    (5, 2, 10, CAST('12-2-20' AS date)),
    (1, 3, 15, CAST('13-2-20' AS date)),
    (2, 1, 20, CAST('13-2-20' AS date)),
    (2, 3, 25, CAST('14-2-20' AS date)),
    (3, 1, 20, CAST('15-2-20' AS date)),
    (3, 2, 15, CAST('15-2-20' AS date)),
    (1, 4, 5, CAST('16-2-20' AS date));

SELECT
    user_id
from
    (
        select
            DISTINCT user_id
        FROM
            (
                SELECT
                    sender AS user_id
                FROM
                    transactions
                UNION
                SELECT
                    receiver AS user_id
                FROM
                    transactions
            ) AS all_users
    );

-------------------3-----------------------
DROP TABLE IF exists items;

CREATE TABLE ITEMS (date date, item text);

INSERT INTO
    items ("date", item)
VALUES
    (CAST('01-01-20' AS date), 'apple'),
    (CAST('01-01-20' AS date), 'apple'),
    (CAST('01-01-20' AS date), 'pear'),
    (CAST('01-01-20' AS date), 'pear'),
    (CAST('01-02-20' AS date), 'pear'),
    (CAST('01-02-20' AS date), 'pear'),
    (CAST('01-02-20' AS date), 'pear'),
    (CAST('01-02-20' AS date), 'orange');

SELECT
    DISTINCT i."date",
    i.item
FROM
    items i
    JOIN (
        SELECT
            "date",
            item,
            COUNT(*) AS item_count
        FROM
            items
        GROUP BY
            "date",
            item
    ) AS ic ON i."date" = ic."date"
    AND i.item = ic.item
    JOIN (
        SELECT
            "date",
            MAX(item_count) AS max_count
        FROM
            (
                SELECT
                    "date",
                    item,
                    COUNT(*) AS item_count
                FROM
                    items
                GROUP BY
                    "date",
                    item
            ) AS sub
        GROUP BY
            "date"
    ) AS max_counts ON ic."date" = max_counts."date"
    AND ic.item_count = max_counts.max_count
ORDER BY
    i."date",
    i.item;

---------------------------4---------------------------
---------------------------5----------------------------
drop table if exists users;

create table users (
    user_id integer,
    product_id integer,
    transaction_date date
);

INSERT INTO
    users (user_id, product_id, transaction_date)
VALUES
    (1, 101, CAST('12-2-20' AS date)),
    (2, 105, CAST('13-2-20' AS date)),
    (1, 111, CAST('14-2-20' AS date)),
    (3, 121, CAST('15-2-20' AS date)),
    (1, 101, CAST('16-2-20' AS date)),
    (2, 105, CAST('17-2-20' AS date)),
    (4, 101, CAST('16-2-20' AS date)),
    (3, 105, CAST('15-2-20' AS date));

select
    user_id,
    (
        CASE
            WHEN COUNT(*) >= 2 THEN (
                SELECT
                    transaction_date
                FROM
                    users u2
                WHERE
                    u2.user_id = u1.user_id
                ORDER BY
                    transaction_date
                LIMIT
                    1 OFFSET 1
            )
            ELSE NULL
        END
    ) AS second_transaction_date
from
    users as u1
group by
    user_id
order by
    second_transaction_date;

------------------------------6----------------------------------------
DROP TABLE IF EXISTS FRIENDS CASCADE;

DROP TABLE IF EXISTS LIKES CASCADE;

CREATE TABLE FRIENDS (USER_ID INTEGER, FRIEND INTEGER);

CREATE TABLE LIKES (user_id INTEGER, page_likes CHAR);

INSERT INTO
    friends (user_id, friend)
VALUES
    (1, 2),
    (1, 3),
    (1, 4),
    (2, 1),
    (3, 1),
    (3, 4),
    (4, 1),
    (4, 3);

INSERT INTO
    likes (user_id, page_likes)
VALUES
    (1, 'A'),
    (1, 'B'),
    (1, 'C'),
    (2, 'A'),
    (3, 'B'),
    (3, 'C'),
    (4, 'B');

SELECT
    DISTINCT FRIENDS.USER_ID,
    PAGE_LIKES AS RECOMMENDED_PAGE
FROM
    FRIENDS
    INNER JOIN LIKES ON LIKES.USER_ID = FRIENDS.FRIEND
WHERE
    LIKES.PAGE_LIKES NOT IN (
        SELECT
            PAGE_LIKES
        FROM
            LIKES
        WHERE
            LIKES.USER_ID = FRIENDS.USER_ID
    )
ORDER BY
    FRIENDS.USER_ID;

------------------------7--------------------------------
DROP TABLE IF EXISTS MOBILE;

DROP TABLE IF EXISTS WEB;

CREATE TABLE MOBILE (USER_ID INTEGER, PAGE_URL CHAR);

CREATE TABLE WEB (USER_ID INTEGER, PAGE_URL CHAR);

INSERT INTO
    mobile (user_id, page_url)
VALUES
    (1, 'A'),
    (2, 'B'),
    (3, 'C'),
    (4, 'A'),
    (9, 'B'),
    (2, 'C'),
    (10, 'B');

INSERT INTO
    web (user_id, page_url)
VALUES
    (6, 'A'),
    (2, 'B'),
    (3, 'C'),
    (7, 'A'),
    (4, 'B'),
    (8, 'C'),
    (5, 'B');

WITH ALL_USERS AS (
    SELECT
        USER_ID
    FROM
        MOBILE
    UNION
    SELECT
        USER_ID
    FROM
        WEB
),
MOBILE_USERS AS (
    SELECT
        USER_ID
    FROM
        MOBILE
),
WEB_USERS AS (
    SELECT
        USER_ID
    FROM
        WEB
)
SELECT
    (
        CAST(
            (
                SELECT
                    COUNT(*)
                FROM
                    MOBILE
                WHERE
                    MOBILE.USER_ID NOT IN (
                        SELECT
                            USER_ID
                        FROM
                            WEB_USERS
                    )
            ) AS REAL
        ) / COUNT(*)
    ) AS MOBILE_USAGE,
    (
        CAST(
            (
                SELECT
                    COUNT(*)
                FROM
                    WEB
                WHERE
                    WEB.USER_ID NOT IN (
                        SELECT
                            USER_ID
                        FROM
                            MOBILE_USERS
                    )
            ) AS REAL
        ) / COUNT(*)
    ) AS WEB_USAGE,
    (
        CAST(
            (
                SELECT
                    COUNT(*)
                FROM
                    WEB
                WHERE
                    WEB.USER_ID IN (
                        SELECT
                            USER_ID
                        FROM
                            MOBILE_USERS
                    )
            ) AS REAL
        ) / COUNT(*)
    ) AS BOTH_USAGE
FROM
    ALL_USERS;

------------------------------8------------------------------------
SET
    datestyle to SQL,
    MDY;

DROP TABLE IF EXISTS USERS;

DROP TABLE IF EXISTS EVENTS;

CREATE TABLE USERS (USER_ID INTEGER, NAME TEXT, JOIN_DATE DATE);

CREATE TABLE EVENTS (USER_ID INTEGER, TYPE TEXT, ACCESS_DATE DATE);

INSERT INTO
    users (user_id, name, join_date)
VALUES
    (1, 'Jon', CAST('2-14-20' AS date)),
    (2, 'Jane', CAST('2-14-20' AS date)),
    (3, 'Jill', CAST('2-15-20' AS date)),
    (4, 'Josh', CAST('2-15-20' AS date)),
    (5, 'Jean', CAST('2-16-20' AS date)),
    (6, 'Justin', CAST('2-17-20' AS date)),
    (7, 'Jeremy', CAST('2-18-20' AS date));

SELECT
    *
FROM
    USERS;

INSERT INTO
    events (user_id, type, access_date)
VALUES
    (1, 'F1', CAST('3-1-20' AS date)),
    (2, 'F2', CAST('3-2-20' AS date)),
    (2, 'P', CAST('3-12-20' AS date)),
    (3, 'F2', CAST('3-15-20' AS date)),
    (4, 'F2', CAST('3-15-20' AS date)),
    (1, 'P', CAST('3-16-20' AS date)),
    (3, 'P', CAST('3-22-20' AS date));

SET
    datestyle to SQL,
    DMY;

WITH UPGRADED_USERS AS (
    SELECT
        USERS.USER_ID,
        USERS.JOIN_DATE,
        EVENTS.ACCESS_DATE
    FROM
        USERS
        INNER JOIN EVENTS ON USERS.USER_ID = EVENTS.USER_ID
    WHERE
        EVENTS.TYPE = 'F2'
)
SELECT
    CAST(
        CAST(COUNT(*) AS REAL) / (
            SELECT
                COUNT(*)
            FROM
                UPGRADED_USERS
        ) AS NUMERIC(3, 2)
    ) AS UPGRADE_RATE
FROM
    UPGRADED_USERS
WHERE
    ACCESS_DATE - JOIN_DATE < 30;

-----------------------9------------------------------------------
DROP TABLE IF EXISTS FRIENDS;

CREATE TABLE FRIENDS (USER1 INTEGER, USER2 INTEGER);

INSERT INTO
    friends (user1, user2)
VALUES
    (1, 2),
    (1, 3),
    (1, 4),
    (2, 3);

WITH USERS AS (
    SELECT
        USER1
    FROM
        friends
    UNION
    SELECT
        USER2
    FROM
        FRIENDS
)
SELECT
    U1.USER1 AS USER_ID,
    (
        SELECT
            COUNT(*)
        FROM
            FRIENDS
        WHERE
            FRIENDS.USER1 = U1.USER1
    ) + (
        SELECT
            COUNT(*)
        FROM
            FRIENDS
        WHERE
            FRIENDS.USER2 = U1.USER1
    ) AS FRIENDS
FROM
    USERS U1
ORDER BY
    U1.USER1;

--------------------------------10------------------------------------------
DROP TABLE IF EXISTS projects;

CREATE TABLE projects (task_id INTEGER, start_date DATE, end_date DATE);

INSERT INTO
    projects (task_id, start_date, end_date)
VALUES
    (
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
    SELECT
        task_id,
        start_date,
        end_date,
        CASE
            WHEN start_date = LAG (end_date) OVER (
                ORDER BY
                    start_date
            ) THEN 0
            ELSE 1
        END AS new_project_flag
    FROM
        projects
),
GroupedProjects AS (
    SELECT
        task_id,
        start_date,
        end_date,
        SUM(new_project_flag) OVER (
            ORDER BY
                start_date ROWS BETWEEN UNBOUNDED PRECEDING
                AND CURRENT ROW
        ) AS project_idP
    FROM
        ProjectGroups
),
ProjectDurations AS (
    SELECT
        project_id,
        MIN(start_date) AS project_start_date,
        MAX(end_date) AS project_end_date,
        COUNT(*) AS number_of_days
    FROM
        GroupedProjects
    GROUP BY
        project_id
)
SELECT
    project_start_date,
    project_end_date,
    number_of_days
FROM
    ProjectDurations
ORDER BY
    number_of_days ASC,
    project_start_date DESC;

--------------------------------11--------------------------------------
DROP TABLE IF EXISTS ATTENDANCE;

DROP TABLE IF EXISTS STUDENTS;

CREATE TABLE ATTENDANCE (
    STUDENT_ID INTEGER,
    SCHOOL_DATE DATE,
    ATTENDANCE INTEGER
);

CREATE TABLE STUDENTS (
    STUDENT_ID INTEGER,
    SCHOOL_ID INTEGER,
    GRADE_LEVEL INTEGER,
    DATE_OF_BIRTH DATE
);

INSERT INTO
    attendance (student_id, school_date, attendance)
VALUES
    (1, CAST('2020-04-03' AS date), 0),
    (2, CAST('2020-04-03' AS date), 1),
    (3, CAST('2020-04-03' AS date), 1),
    (1, CAST('2020-04-04' AS date), 1),
    (2, CAST('2020-04-04' AS date), 1),
    (3, CAST('2020-04-04' AS date), 1),
    (1, CAST('2020-04-05' AS date), 0),
    (2, CAST('2020-04-05' AS date), 1),
    (3, CAST('2020-04-05' AS date), 1),
    (4, CAST('2020-04-05' AS date), 1);

INSERT INTO
    students (
        student_id,
        school_id,
        grade_level,
        date_of_birth
    )
VALUES
    (1, 2, 5, CAST('2012-04-03' AS date)),
    (2, 1, 4, CAST('2013-04-04' AS date)),
    (3, 1, 3, CAST('2014-04-05' AS date)),
    (4, 2, 4, CAST('2013-04-03' AS date));

SELECT
    CAST(
        CAST(COUNT(*) AS REAL) / (
            SELECT
                COUNT(*)
            FROM
                STUDENTS
        ) AS NUMERIC(3, 2)
    )
FROM
    STUDENTS
    INNER JOIN ATTENDANCE ON students.student_id = ATTENDANCE.student_id
WHERE
    ATTENDANCE.ATTENDANCE = 1
    AND DATE_PART ('DAY', ATTENDANCE.SCHOOL_DATE) = DATE_PART ('DAY', STUDENTS.DATE_OF_BIRTH)
    AND DATE_PART ('MONTH', ATTENDANCE.SCHOOL_DATE) = DATE_PART ('MONTH', STUDENTS.DATE_OF_BIRTH);

---------------------------12---------------------------------------------------
DROP TABLE IF EXISTS HACKERS;

DROP TABLE IF EXISTS SUBMISSIONS;

CREATE TABLE HACKERS (HACKER_ID INTEGER, NAME TEXT);

CREATE TABLE SUBMISSIONS (
    SUBMISSION_ID INTEGER,
    HACKER_ID INTEGER,
    CHALLENGE_ID INTEGER,
    SCORE INTEGER
);

INSERT INTO
    hackers (hacker_id, name)
VALUES
    (1, 'John'),
    (2, 'Jane'),
    (3, 'Joe'),
    (4, 'Jim');

INSERT INTO
    submissions (submission_id, hacker_id, challenge_id, score)
VALUES
    (101, 1, 1, 10),
    (102, 1, 1, 12),
    (103, 2, 1, 11),
    (104, 2, 1, 9),
    (105, 2, 2, 13),
    (106, 3, 1, 9),
    (107, 3, 2, 12),
    (108, 3, 2, 15),
    (109, 4, 1, 0);

SELECT
    HACKERS.*,
    SUM(SUB1.SCORE) AS TOTAL_SCORE
FROM
    HACKERS
    JOIN SUBMISSIONS SUB1 ON HACKERS.HACKER_ID = SUB1.HACKER_ID
WHERE
    SUB1.SCORE = (
        SELECT
            MAX(SUB2.SCORE)
        FROM
            SUBMISSIONS SUB2
        WHERE
            SUB2.HACKER_ID = HACKERS.HACKER_ID
            AND SUB2.CHALLENGE_ID = SUB1.CHALLENGE_ID
    )
GROUP BY
    HACKERS.HACKER_ID,
    hackers.name
HAVING
    SUM(SUB1.SCORE) > 0;

---------------------------------13---------------------------------------------------
DROP TABLE IF EXISTS scores;

CREATE TABLE scores (id INTEGER, score DECIMAL(3, 2));

INSERT INTO
    scores (id, score)
VALUES
    (1, 3.50),
    (2, 3.65),
    (3, 4.00),
    (4, 3.85),
    (5, 4.00),
    (6, 3.65);

SELECT
    s1.id,
    s1.score,
    COUNT(DISTINCT s2.score) AS rank
FROM
    scores s1
    JOIN scores s2 ON s1.score <= s2.score
GROUP BY
    s1.id,
    s1.score
ORDER BY
    rank;

-----------------------------14------------------------------------
DROP TABLE IF EXISTS EMPLOYEE;

CREATE TABLE EMPLOYEE(
    ID INTEGER,
    PAY_MONTH INTEGER,
    SALARY INTEGER
);

INSERT INTO
    employee (id, pay_month, salary)
VALUES
    (1, 1, 20),
    (2, 1, 20),
    (1, 2, 30),
    (2, 2, 30),
    (3, 2, 40),
    (1, 3, 40),
    (3, 3, 60),
    (1, 4, 60),
    (3, 4, 70);

SELECT
    ID,
    PAY_MONTH,
    SALARY,
    (
        SELECT
            SUM(SALARY)
        FROM
            EMPLOYEE EMP3
        WHERE
            EMP3.PAY_MONTH <= EMP1.PAY_MONTH
            AND EMP1.ID = EMP3.ID
    ) AS ACCUMULATIVE_SUM
FROM
    EMPLOYEE EMP1
WHERE
    PAY_MONTH < (
        SELECT
            MIN(PAY_MONTH)
        FROM
            EMPLOYEE EMP2
        WHERE
            EMP1.ID = EMP2.ID
    ) + 3
ORDER BY
    ID,
    PAY_MONTH;

---------------------------------15-----------------------------------
DROP TABLE IF EXISTS TEAMS;

DROP TABLE IF EXISTS MATCHES;

CREATE TABLE TEAMS(TEAM_ID INTEGER, TEAM_NAME TEXT);

CREATE TABLE MATCHES(
    MATCH_ID INTEGER,
    HOST_TEAM INTEGER,
    GUEST_TEAM INTEGER,
    HOST_GOALS INTEGER,
    GUEST_GOALS INTEGER
);

INSERT INTO
    teams (team_id, team_name)
VALUES
    (1, 'New York'),
    (2, 'Atlanta'),
    (3, 'Chicago'),
    (4, 'Toronto'),
    (5, 'Los Angeles'),
    (6, 'Seattle');

INSERT INTO
    matches (
        match_id,
        host_team,
        guest_team,
        host_goals,
        guest_goals
    )
VALUES
    (1, 1, 2, 3, 0),
    (2, 2, 3, 2, 4),
    (3, 3, 4, 4, 3),
    (4, 4, 5, 1, 1),
    (5, 5, 6, 2, 1),
    (6, 6, 1, 1, 2);

WITH HostPoints AS (
    SELECT
        host_team AS team_id,
        SUM(
            CASE
                WHEN host_goals > guest_goals THEN 3
                WHEN host_goals = guest_goals THEN 1
                ELSE 0
            END
        ) AS points
    FROM
        matches
    GROUP BY
        host_team
),
GuestPoints AS (
    SELECT
        guest_team AS team_id,
        SUM(
            CASE
                WHEN guest_goals > host_goals THEN 3
                WHEN guest_goals = host_goals THEN 1
                ELSE 0
            END
        ) AS points
    FROM
        matches
    GROUP BY
        guest_team
),
TotalPoints AS (
    SELECT
        team_id,
        SUM(points) AS total_points
    FROM
        (
            SELECT
                *
            FROM
                HostPoints
            UNION
            ALL
            SELECT
                *
            FROM
                GuestPoints
        ) AS combined_points
    GROUP BY
        team_id
)
SELECT
    t.team_name,
    tp.total_points
FROM
    TotalPoints tp
    JOIN teams t ON tp.team_id = t.team_id
ORDER BY
    tp.total_points DESC,
    t.team_name;

--------------------------------------16-----------------------------------------
DROP TABLE IF EXISTS CUSTOMERS;

DROP TABLE IF EXISTS ORDERS;

CREATE TABLE CUSTOMERS(ID INTEGER, NAME TEXT);

CREATE TABLE ORDERS(
    ORDER_ID INTEGER,
    CUSTOMER_ID INTEGER,
    PRODUCT_NAME CHAR
);

INSERT INTO
    customers (id, name)
VALUES
    (1, 'Daniel'),
    (2, 'Diana'),
    (3, 'Elizabeth'),
    (4, 'John');

INSERT INTO
    orders (order_id, customer_id, product_name)
VALUES
    (1, 1, 'A'),
    (2, 1, 'B'),
    (3, 2, 'A'),
    (4, 2, 'B'),
    (5, 2, 'C'),
    (6, 3, 'A'),
    (7, 3, 'A'),
    (8, 3, 'B'),
    (9, 3, 'D');

WITH A AS(
    SELECT
        CUSTOMER_ID
    FROM
        ORDERS
    WHERE
        ORDERS.PRODUCT_NAME = 'A'
),
B AS(
    SELECT
        CUSTOMER_ID
    FROM
        ORDERS
    WHERE
        ORDERS.PRODUCT_NAME = 'B'
),
C AS(
    SELECT
        CUSTOMER_ID
    FROM
        ORDERS
    WHERE
        ORDERS.PRODUCT_NAME = 'C'
)
SELECT
    A.customer_id,
    NAME
FROM
    A
    INNER JOIN customers ON customers.ID = A.customer_id
WHERE
    A.customer_id IN (
        SELECT
            *
        FROM
            B
    )
    AND A.customer_id NOT IN (
        SELECT
            *
        FROM
            C
    )
ORDER BY
    ID;

------------------------------17------------------------------
----------------------------18----------------------------
-----------------------------19---------------------------------
DROP TABLE IF EXISTS USERS;

CREATE TABLE USERS(
    USER_ID INTEGER,
    JOIN_DATE DATE,
    INVITED_BY INTEGER
);

SET
    datestyle to SQL,
    MDY;

INSERT INTO
    users (user_id, join_date, invited_by)
VALUES
    (1, CAST('01-01-20' AS date), 0),
    (2, CAST('01-10-20' AS date), 1),
    (3, CAST('02-05-20' AS date), 2),
    (4, CAST('02-12-20' AS date), 3),
    (5, CAST('02-25-20' AS date), 2),
    (6, CAST('03-01-20' AS date), 0),
    (7, CAST('03-01-20' AS date), 4),
    (8, CAST('03-04-20' AS date), 7);

SET
    datestyle to SQL,
    DMY;

SELECT
    user_id,
    (
        SELECT
            AVG(u2.join_date - u1.join_date)
        FROM
            USERS U2
        WHERE
            U2.INVITED_BY = U1.USER_ID
    )
FROM
    USERS u1;

--------------------------------20-----------------------
DROP TABLE IF EXISTS ATTENDANCE;

CREATE TABLE ATTENDANCE(EVENT_DATE DATE, VISITORS INTEGER);

INSERT INTO
    attendance (event_date, visitors)
VALUES
    (CAST('01-01-20' AS date), 10),
    (CAST('01-04-20' AS date), 109),
    (CAST('01-05-20' AS date), 150),
    (CAST('01-06-20' AS date), 99),
    (CAST('01-07-20' AS date), 145),
    (CAST('01-08-20' AS date), 1455),
    (CAST('01-11-20' AS date), 199),
    (CAST('01-12-20' AS date), 188);

WITH NEXT_DAY_ATTENDANCE AS (
    SELECT
        E1.EVENT_DATE,
        (
            SELECT
                E2.visitors
            FROM
                ATTENDANCE E2
            WHERE
                E2.EVENT_DATE > E1.EVENT_DATE
            ORDER BY
                E2.EVENT_DATE ASC
            LIMIT
                1
        )
    FROM
        ATTENDANCE E1
),
NEXT_NEXT_DAY_ATTENDANCE AS (
    SELECT
        E1.EVENT_DATE,
        (
            SELECT
                E2.visitors
            FROM
                ATTENDANCE E2
            WHERE
                E2.EVENT_DATE > E1.EVENT_DATE
            ORDER BY
                E2.EVENT_DATE ASC OFFSET 1
            LIMIT
                1
        )
    FROM
        ATTENDANCE E1
)
SELECT
    E1.EVENT_DATE,
    E1.VISITORS
FROM
    ATTENDANCE E1
    INNER JOIN NEXT_DAY_ATTENDANCE E2 ON E2.EVENT_DATE = E1.EVENT_DATE
    INNER JOIN NEXT_NEXT_DAY_ATTENDANCE E3 ON E1.EVENT_DATE = E3.EVENT_DATE
WHERE
    E1.VISITORS > 100
    AND (
        E2.VISITORS > 100
        OR E2.VISITORS IS NULL
    )
    AND (
        E3.VISITORS > 100
        OR E3.VISITORS IS NULL
    );

---------------------------------------21---------------------------------
-- Create and populate tables
DROP TABLE IF EXISTS ORDERS;

DROP TABLE IF EXISTS PRODUCTS;

CREATE TABLE ORDERS(
    ORDER_ID INTEGER,
    CUSTOMER_ID INTEGER,
    PRODUCT_ID INTEGER
);

CREATE TABLE PRODUCTS(ID INTEGER, NAME TEXT);

INSERT INTO
    orders (order_id, customer_id, product_id)
VALUES
    (1, 1, 1),
    (1, 1, 2),
    (1, 1, 3),
    (2, 2, 1),
    (2, 2, 2),
    (2, 2, 4),
    (3, 1, 5);

INSERT INTO
    products (id, name)
VALUES
    (1, 'A'),
    (2, 'B'),
    (3, 'C'),
    (4, 'D'),
    (5, 'E');

-- Query to find the top 3 pairs of products frequently bought together
WITH product_pairs AS (
    SELECT
        LEAST(o1.product_id, o2.product_id) AS product_id1,
        GREATEST(o1.product_id, o2.product_id) AS product_id2
    FROM
        ORDERS o1
        JOIN ORDERS o2 ON o1.order_id = o2.order_id
        AND o1.product_id < o2.product_id
),
pair_frequencies AS (
    SELECT
        product_id1,
        product_id2,
        COUNT(*) AS frequency
    FROM
        product_pairs
    GROUP BY
        product_id1,
        product_id2
    ORDER BY
        frequency DESC
    LIMIT
        3
)
SELECT
    p1.name || ' ' || p2.name AS product_pair,
    pf.frequency
FROM
    pair_frequencies pf
    JOIN PRODUCTS p1 ON pf.product_id1 = p1.id
    JOIN PRODUCTS p2 ON pf.product_id2 = p2.id
ORDER BY
    pf.frequency DESC,
    P1.NAME,
    P2.NAME;

------------------------------------22--------------------------------
DROP TABLE IF EXISTS STUDY;

CREATE TABLE STUDY(
    participant_id INTEGER,
    ASSIGNMENT INTEGER,
    OUTCOME INTEGER
);

INSERT INTO
    study (participant_id, assignment, outcome)
VALUES
    (1, 0, 0),
    (2, 1, 1),
    (3, 0, 1),
    (4, 1, 0),
    (5, 0, 1),
    (6, 1, 1),
    (7, 0, 0),
    (8, 1, 1),
    (9, 1, 1);

WITH GROUP1 AS(
    SELECT
        *
    FROM
        STUDY
    WHERE
        STUDY.ASSIGNMENT = 1
),
GROUP0 AS(
    SELECT
        *
    FROM
        STUDY
    WHERE
        STUDY.ASSIGNMENT = 0
),
AVG_ONE AS (
    SELECT
        AVG(OUTCOME) AS AVG1
    FROM
        GROUP1
),
AVG_ZERO AS (
    SELECT
        AVG(OUTCOME) AS AVG0
    FROM
        GROUP0
),
VARIANCE_ONE AS(
    SELECT
        SUM(
            POW(
                (
                    GROUP1.OUTCOME - (
                        SELECT
                            *
                        FROM
                            AVG_ONE
                    )
                ),
                2
            )
        ) /(COUNT(*) -1) AS VARIANCE
    FROM
        GROUP1
),
VARIANCE_ZERO AS(
    SELECT
        SUM(
            POW(
                (
                    GROUP0.OUTCOME - (
                        SELECT
                            *
                        FROM
                            AVG_ZERO
                    )
                ),
                2
            )
        ) /(COUNT(*) -1) AS VARIANCE
    FROM
        GROUP0
),
STANDARD_ERROR AS(
    SELECT
        SQRT(
            VARIANCE / (
                SELECT
                    COUNT(*)
                FROM
                    GROUP1
            ) + (
                SELECT
                    *
                FROM
                    VARIANCE_ZERO
            ) / (
                SELECT
                    COUNT(*)
                FROM
                    GROUP0
            )
        )
    FROM
        VARIANCE_ONE
),
ATE AS (
    SELECT
        AVG1 - (
            SELECT
                *
            FROM
                AVG_ZERO
        ) AS ATE
    FROM
        AVG_ONE
)
SELECT
    ATE.ATE AS POINT_ESTIMATE,
    ATE.ATE - 1.96 * (
        SELECT
            *
        FROM
            STANDARD_ERROR
    ) AS LOWER_BOND,
    ATE.ATE + 1.96 * (
        SELECT
            *
        FROM
            STANDARD_ERROR
    ) AS UPPER_BOND
FROM
    ATE;