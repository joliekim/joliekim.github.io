import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      <div className="title">
        <h1 className="name">Heeji (Jolie) Kim</h1><br />
        HCI Researcher<br />
        MSc. Candidate @ KAIST<br />
        Daejeon / Seoul, South Korea
      </div>

      <div className="social-links">
        <a href="mailto:jolieheejikim@kaist.ac.kr">
          <img src="/icons/email.png" alt="Email" />
        </a>
        <a href="https://www.linkedin.com/in/jolieheejikim" target="_blank" rel="noreferrer">
          <img src="/icons/linkedin.png" alt="LinkedIn" />
        </a>
        <a href="https://www.instagram.com/jolieheejikim" target="_blank" rel="noreferrer">
          <img src="/icons/instagram.png" alt="Instagram" />
        </a>
        <a href="/cv.pdf" target="_blank" rel="noreferrer">
          <img src="/icons/cv.png" alt="CV" />
        </a>
      </div>

      <div className="bio">
        I am an HCI researcher and a MSc. candidate in the <a href="https://id.kaist.ac.kr/home" target="_blank" rel="noreferrer">Department of Industrial Design </a> 
        at <a href="https://www.kaist.ac.kr/en/index.html" target="_blank" rel="noreferrer">KAIST</a>, 
        where I explore the intersection of physical and digital interaction in <a href="https://make.kaist.ac.kr/" target="_blank" rel="noreferrer">Make Lab </a> 
        led by Prof. <a href="https://make.kaist.ac.kr/andrea" target="_blank" rel="noreferrer">Andrea Bianchi</a>.<br />
        <br />
        My work centers on developing interactive systems and tools that support increased expressiveness, creativity 
        and enhanced productivity. <br />
        <br />
        Before joining KAIST, I earned a B.S. in <a href="https://cdmstudentcouncil1.wixsite.com/yonseicdm" target="_blank" rel="noreferrer">Culture and Design Management</a> from <a href="https://www.yonsei.ac.kr/en_sc/index.jsp" target="_blank" rel="noreferrer">Yonsei University</a>. I also gained professional experience working 
        across diverse industries including AdTech, Blockchain, and F&B, where I co-founded a startup 
        focused on sustainable food innovation.
      </div>

      <div className="photo-grid">
        <img src="/images/travel.png" alt="Portfolio image 1" />
        <img src="/images/design.png" alt="Portfolio image 2" />
        <img src="/images/coffee.png" alt="Portfolio image 3" />
        <img src="/images/art.png" alt="Portfolio image 4" />
        <img src="/images/food.png" alt="Portfolio image 5" />
        <img src="/images/relationship.png" alt="Portfolio image 6" />
      </div>
    </>
  )
}

export default Home
