import PropTypes from 'prop-types';
import { Part } from './Part';

export const Content = ({ parts }) => {
    return (
        <div>
            {parts.map((part) => <Part key={part.id} part={part} />)}
            <p>total of {parts.reduce((sum, current) => sum + current.exercises,0)} exercises</p>
        </div>
    )
}

Content.propTypes = {
    parts: PropTypes.array.isRequired
}