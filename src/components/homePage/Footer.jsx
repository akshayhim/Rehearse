import './footer.css';
import twitter from '../../assets/icons8-twitter.svg';
import linkedin from '../../assets/icons8-linkedin.svg';
import github from '../../assets/icons8-github.svg';

const Footer=()=>{
    return (
        <div className="footer">
            <div className="sb_footer section_padding">
                <div className="sb_footer-links">
                
                <div className="sb_footer-below">
                    <div className="sb_footer-copyright">
                        <p>
                            @{new Date().getFullYear()} Rehearse. All rights reserved.
                        </p>
                    </div>
                </div>
                <div className='sb_footer-links_div'>
                    <div className="socialmedia">

                        <p><a href="https://www.twitter.com/dedaf_" target="blank"><img src={twitter} alt=""></img></a></p>
                        <p><a href="https://www.linkedin.com/in/akshay-himatsingka/" target="blank"><img src={linkedin} alt="" /></a></p>
                        <p><a href="https://github.com/akshayhim" target="blank"><img src={github} alt="" /></a></p>
                    </div>
                </div>
                <hr />
                <div className="sb_footer-below">
                    <div className="sb_footer-below-links">
                        <a href="/#"><div><p>Terms & Conditions</p></div></a>
                        <a href="/#"><div><p>Privacy</p></div></a>
                        <a href="/#"><div><p>Security</p></div></a>
                        <a href="/#"><div><p>Cookie Declaration</p></div></a>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Footer;