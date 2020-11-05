function StartPage(props) {
    return (
        <div id="start-page">
            <div id="registration">
                <form id="create-user">
                    <label>Username</label><br/>
                    <input id="username" name="username" autocomplete="off" type="text" value={props.username} onChange={props.handleChange} />
                    <button onClick={props.handleClick}>Submit</button>
                </form>
                <p id="registration-error" class="error-message"></p>
            </div>
        </div>
    );
}

export default StartPage;