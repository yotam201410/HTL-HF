import PropTypes from 'prop-types';

export const CoreConcepts = (props) => {
    const { image, title, description } = props;
    return (
        <li>
            <img src={image} alt={title} />
            <h3>{title}</h3>
            <p>{description}</p>
        </li>
    );
}

CoreConcepts.propTypes = {
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
};