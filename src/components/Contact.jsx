import Navbar from './homePage/Navbar'
import { Typography } from "@mui/material";
import IG from '../assets/icons8-instagram.svg'
import Twitter from '../assets/icons8-twitter.svg'
import Linkedin from '../assets/icons8-linkedin.svg'
import './contact.css'

const Contact = () => {
    return(
        <div className="surroundingDiv">
        <Navbar />
        <Typography
            variant="h7"
            component="h2"
            gutterBottom
            sx={{
              color: "#f5f5f5",
              position: "relative",
              top: "50px",
              lineHeight:"70px",
              left:"0px",
            }}
          >
            Created by:  Akshay Himatsingka
            <br />
            Email:  akshayhimatsingka@gmail.com
            <br />
            Socials: 
            <div className='socialIcons'>
                <a href="https://www.instagram.com/_akshay.h/" target='blank'><img src={IG} alt="" /></a>
                <a href="https://twitter.com/dedaf_" target='blank'><img src={Twitter} alt="" /></a>
                <a href="https://www.linkedin.com/in/akshay-himatsingka/" target='blank'><img src={Linkedin} alt="" /></a>
            </div>
            <hr />
            <div>
                If you want to contribute to this project, head over to - <a href="https://github.com/akshayhim/Rehearse" target='blank'>Rehearse Github Repo</a>
            </div>
          </Typography>

        </div>
    )
}

export default Contact;