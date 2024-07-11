export const Filter = ({searchWord, setSearchWord}) => {
    return (
        <div>
            search: <input placeholder="enter search word" value={searchWord} onChange={(event) => setSearchWord(event.target.value)} />
        </div>
    )
}