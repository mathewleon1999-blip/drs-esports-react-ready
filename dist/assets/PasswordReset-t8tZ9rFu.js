import{b as y,r as t,j as e,m as d,L as m}from"./index-DgDZGFqk.js";import{N as v,F as N}from"./Footer-DbYKpWxH.js";function S(){const[x]=y(),r=x.get("mode")||"request",[h,g]=t.useState(""),[l,b]=t.useState(""),[p,f]=t.useState(""),[i,a]=t.useState(!1),[n,c]=t.useState(""),[o,u]=t.useState(""),w=async s=>{s.preventDefault(),a(!0),c(""),setTimeout(()=>{a(!1),u("Password reset link has been sent to your email!")},1500)},j=async s=>{if(s.preventDefault(),a(!0),c(""),l!==p){c("Passwords do not match"),a(!1);return}if(l.length<8){c("Password must be at least 8 characters"),a(!1);return}setTimeout(()=>{a(!1),u("Password has been reset successfully!")},1500)};return e.jsxs(e.Fragment,{children:[e.jsx(v,{}),e.jsxs("div",{className:"page-container",children:[e.jsx("section",{className:"password-reset-hero",children:e.jsxs(d.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{duration:.8},children:[e.jsxs("h1",{children:[r==="request"&&"Reset Your Password",r==="reset"&&"Create New Password",r==="success"&&"Password Reset Complete"]}),e.jsxs("p",{children:[r==="request"&&"Enter your email to receive a password reset link",r==="reset"&&"Enter your new password below",r==="success"&&"Your password has been reset successfully"]})]})}),e.jsxs("section",{className:"password-reset-section",children:[r==="success"?e.jsxs(d.div,{className:"reset-success",initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},children:[e.jsx("div",{className:"success-icon",children:"✓"}),e.jsx("h2",{children:"Success!"}),e.jsx("p",{children:o}),e.jsx(m,{to:"/login",className:"primary-btn",children:"Go to Login"})]}):r==="reset"?e.jsx(d.div,{className:"reset-form-container",initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},children:e.jsxs("form",{onSubmit:j,children:[n&&e.jsx("div",{className:"error-message",children:n}),o&&e.jsx("div",{className:"success-message",children:o}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"New Password"}),e.jsx("input",{type:"password",value:l,onChange:s=>b(s.target.value),placeholder:"Enter new password",required:!0,minLength:8})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Confirm New Password"}),e.jsx("input",{type:"password",value:p,onChange:s=>f(s.target.value),placeholder:"Confirm new password",required:!0})]}),e.jsx("button",{type:"submit",className:"submit-btn",disabled:i,children:i?"Resetting...":"Reset Password"})]})}):e.jsx(d.div,{className:"reset-form-container",initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},children:e.jsxs("form",{onSubmit:w,children:[n&&e.jsx("div",{className:"error-message",children:n}),o&&e.jsx("div",{className:"success-message",children:o}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Email Address"}),e.jsx("input",{type:"email",value:h,onChange:s=>g(s.target.value),placeholder:"Enter your email",required:!0})]}),e.jsx("button",{type:"submit",className:"submit-btn",disabled:i,children:i?"Sending...":"Send Reset Link"})]})}),e.jsx("div",{className:"reset-footer",children:e.jsxs("p",{children:["Remember your password? ",e.jsx(m,{to:"/login",children:"Sign in"})]})}),e.jsxs("div",{className:"security-tips",children:[e.jsx("h3",{children:"🔒 Security Tips"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Use at least 8 characters"}),e.jsx("li",{children:"Include uppercase and lowercase letters"}),e.jsx("li",{children:"Add numbers and special characters"}),e.jsx("li",{children:"Don't use personal information"})]})]})]})]}),e.jsx(N,{}),e.jsx("style",{children:`
        .password-reset-hero {
          padding: 100px 20px;
          text-align: center;
          background: radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%), var(--gradient-dark);
        }

        .password-reset-hero h1 {
          font-size: clamp(32px, 6vw, 48px);
          margin-bottom: 15px;
        }

        .password-reset-hero p {
          color: var(--text-muted);
          font-size: 18px;
        }

        .password-reset-section {
          padding: 60px 20px;
          background: var(--dark-bg);
          max-width: 500px;
          margin: 0 auto;
        }

        .reset-form-container {
          background: var(--card-bg);
          padding: 40px;
          border-radius: 16px;
          border: 1px solid rgba(0, 212, 255, 0.1);
        }

        .reset-form-container .form-group {
          margin-bottom: 20px;
        }

        .reset-form-container label {
          display: block;
          color: var(--text-muted);
          margin-bottom: 8px;
          font-size: 14px;
        }

        .reset-form-container input {
          width: 100%;
          padding: 14px 16px;
          background: var(--dark-bg);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 8px;
          color: var(--text-light);
          font-family: 'Rajdhani', sans-serif;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .reset-form-container input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
        }

        .reset-form-container .submit-btn {
          width: 100%;
          padding: 16px;
          background: var(--gradient-primary);
          border: none;
          border-radius: 8px;
          color: #000;
          font-family: 'Orbitron', sans-serif;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .reset-form-container .submit-btn:hover:not(:disabled) {
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
        }

        .reset-form-container .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .reset-footer {
          text-align: center;
          margin-top: 25px;
        }

        .reset-footer a {
          color: var(--primary);
          font-weight: 600;
        }

        .reset-footer a:hover {
          text-shadow: 0 0 10px var(--primary);
        }

        .reset-success {
          background: var(--card-bg);
          padding: 60px 40px;
          border-radius: 16px;
          border: 1px solid rgba(0, 212, 255, 0.1);
          text-align: center;
        }

        .reset-success .success-icon {
          width: 80px;
          height: 80px;
          background: rgba(74, 222, 128, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: #4ade80;
          margin: 0 auto 25px;
        }

        .reset-success h2 {
          font-size: 28px;
          margin-bottom: 15px;
        }

        .reset-success p {
          color: var(--text-muted);
          margin-bottom: 30px;
        }

        .security-tips {
          margin-top: 40px;
          padding: 25px;
          background: rgba(0, 212, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
        }

        .security-tips h3 {
          font-size: 16px;
          margin-bottom: 15px;
          color: var(--primary);
        }

        .security-tips ul {
          list-style: none;
          display: grid;
          gap: 10px;
        }

        .security-tips li {
          color: var(--text-muted);
          font-size: 14px;
          padding-left: 20px;
          position: relative;
        }

        .security-tips li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--primary);
        }
      `})]})}export{S as default};
