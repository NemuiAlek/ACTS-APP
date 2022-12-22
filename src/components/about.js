import {Link} from "react-router-dom";



export default function About(){
        return (
            <div id="aboutPage">
                 <div className="content">
                    <h1>About</h1>
                    <h3><strong>Developed by <a href="https://www.linkedin.com/in/alek-jonas/" target={'#blank'}>Alek Jonas</a></strong></h3>
                    <h3>v0.1</h3>
                    <hr />
                    <h5>About me</h5>
                    <p>Working as a financial systems analyst and only been using Javascript, HTML, and CSS for 6 months.</p>
                    <p>Really wanting to get better, so if you notice any issues or have any recommendations please reach out to me (links at the bottom or clicking on my name at the top)</p>
                    <hr />
                    <h5>About this project</h5>
                    <p>This was my final project for the IronHack bootcamp, a fun, frustraiting,
                    and incredibly rewarding journey. There is so much more I wanted to add to this app, and so much more polish that it needs,
                    but with a development time of only 2 weeks, a lot of features had to be scrapped.</p>
                    <p>However this is just the beginning! I want to continue to develop this small project and scale it  up to a usuable D&D 5e
                    tool that DMs can use to easily monitor combat, create custom monsters and add them to a tracking board, add campaigns to design
                    and presave all planned encounters, and so much more!</p>
                    <hr />
                    <h3>My links</h3>
                    <h5><a href="https://www.linkedin.com/in/alek-jonas/" target={'#blank'}>Linkedin</a></h5>
                    <h5><a href="https://github.com/NemuiAlek" target={'#blank'}>GitHub</a></h5>
                    <h5><a href="https://nemuialek.github.io/RegicideClone/" target={'#blank'}>Regicide Clone</a></h5>
                    <br />
                </div>
            </div>
    )
    }