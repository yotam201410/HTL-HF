import PropTypes from 'prop-types';

export const Part = ({ part }) => {

    return (<p>{part.name} {part.exercises}</p>)
}

Part.propTypes = {
    part: PropTypes.object.isRequired
}