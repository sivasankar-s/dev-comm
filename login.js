// import GUN from 'gun';
// import 'gun/sea';
// import 'gun/axe';

const gun = new Gun();

// const gun = new Gun();
      // const user = gun.user();
      const user = gun.user();
      const loginBtn = document.getElementById("loginBtn");
      const registerBtn = document.getElementById("registerBtn");
      const usernameInput = document.getElementById("username");
      const passwordInput = document.getElementById("password");
      const errorDiv = document.getElementById("error");

      let usrname='';

      if (loginBtn) {
      loginBtn.addEventListener("click", async () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        usrname = username;
        console.log(usrname);
        sessionStorage.setItem('user', JSON.stringify(usrname));

        // try {
          // await 
          // user.auth(username, password, ({ err }) => err && alert(err));
          user.auth(username, password, ({ err }) => 
          {
            if(err){  
              alert(err)
            } else {
              console.log("Login successful!");
          user.get("alias").put(username);
          window.location.href = "index.html";
            }
          });
          
        // } catch (error) {
        //   alert(error);
        //   console.error("Login failed:", error.message);
        //   errorDiv.innerText = error.message;
        // }
      });
    }

    if (registerBtn) {
      registerBtn.addEventListener("click", async () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        usrname=username;

        sessionStorage.setItem('user', JSON.stringify(usrname));

        // try {
          // await 
          // await user.create(username, password, ({ err }) => err && alert(err));
          user.create(username, password, ({ err }) => 
          {
            if(err){  
              alert(err)
            } else {
              user.auth(username, password, ({ err }) => 
          {
            if(err){  
              alert(err)
            } else {
              console.log("Register and Login successful!");
          user.get("alias").put(username);
          window.location.href = "index.html";
            }
          });
            }
          });
          
        // } catch (error) {
        //   alert(error);
        //   console.error("Registration failed:", error.message);
        //   errorDiv.innerText = error.message;
        // }
      });
    }

      export { gun, user, usrname};