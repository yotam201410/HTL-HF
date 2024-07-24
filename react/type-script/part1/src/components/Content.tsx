
interface ContentProps {
    name: string,
    exerciseCount: number
}

const Content = (props: ContentProps) => {
    return (
        <div>
            <p>
                {props.name} {props.exerciseCount}
            </p>
        </div>
    )
}

export default Content
