const { GenFellow } = require("../model/fellow.model")

const fellowIDGenerator = async () => {
  try {
    const allFellows = await GenFellow.find()
    const num = allFellows.length+1

    const newFellowId = `BBYDI/TSN/${num}/${Date.now()}`

    return newFellowId;
  } catch (error) {
    return "Cannot generate User Id, please try again later"
  }

}

const fellowMessage = (fellowId, email) => {
  return ( `<div>
    <b>Hello Fellow!</b><br>
    <p>You receive this mail because you have successfully been registered as our online safety fellow, here's your fellow ID <b>${fellowId}</b></p> <br>
    <div>
      <p>Click on the button below to complete your registration</p> <br>
      <a href="https://thesafernet.org/onboarding?email=${email}">
        <button class="padding: 10px 30px; color: white; background: #1a3855">Complete onboarding</button>
      </a>
    </div> <br>
    <p>or login to our website at https://thesafernet.org/onboarding to complete your registration with your fellow ID and your email address.</p> <br>
    
  </div>`)
}

const onboardingMail = name => {
  return ( `<div>
    <b>Dear ${name}!</b><br>
    <p>We are pleased to let you know that you have been successfully registered as a fellow in our online safety fellow. Do not forget to deliver report promptly and proficiently, looking forward to a long lasting fellowship with you.</b></p>
    <p>Best regards from thesafernet.org</p>
  </div>`)
}

module.exports = { fellowIDGenerator, fellowMessage, onboardingMail }