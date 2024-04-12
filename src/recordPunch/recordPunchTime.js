const recordPunch = async () => {
    const now = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const punchTime = now.toLocaleString('en-US', options);
    console.log(`Punched at: ${punchTime}`);
    return punchTime;
   }
   
   export default recordPunch;
   