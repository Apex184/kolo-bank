export function emailVerificationView(token: string, timeRemaining: number): string {
    const link = `http://localhost:8081/kolo/verify/${token}`;
    const minutes = Math.floor(timeRemaining / (1000 * 60));
    const seconds = Math.floor((timeRemaining / 1000) % 60);
    let temp = `
       <div style="max-width: 700px;text-align: center; text-transform: uppercase;
       margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
       <h2 style="color: teal;">Welcome to Kolo Bank</h2>
       <p>Please Follow the link by clicking on the button to verify your email
        </p>
        <div style="text-align:center ;">
          <a href=${link}
         style="background: #277BC0; text-decoration: none; color: white;
          padding: 10px 20px; margin: 10px 0;
         display: inline-block;">Click here</a>
         
        </div>
        <p>Your verification link will expire in:
        ${minutes} minutes ${seconds} seconds
        </p>
     </div>
        `;
    return temp;
}
