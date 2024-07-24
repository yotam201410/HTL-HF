import { Header } from "./Header";
import { Content } from "./Contetnt";
import PropTypes from 'prop-types';

export const Course = ({ course }) => {
    return (
        <div>
            <Header text={course.name} />
            <Content parts={course.parts} />
        </div>)
}

Course.propTypes = {
    course:PropTypes.object.isRequired
}