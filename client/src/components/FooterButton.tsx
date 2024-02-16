import {Link} from "react-router-dom";
import '../stylesheets/Footer.css';

function FooterButton(props: { url: string, icon: string }) {
    return (
        <Link className="footer-button" to={props.url}><i className={props.icon}></i></Link>
    );
}

export default FooterButton;