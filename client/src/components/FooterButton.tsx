import '../stylesheets/Footer.css';

function FooterButton(props: { url: string, icon: string }) {
    return (
        <a className="footer-button" href={props.url}><i className={props.icon}></i></a>
    );
}

export default FooterButton;