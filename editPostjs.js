import {gun ,user, usrname} from "./login.js";

// const gun = Gun();
//const user = gun.user();
let usernameElem = document.getElementById("username");

const userrname = JSON.parse(sessionStorage.getItem('user'));
console.log(userrname);
// console.log(user.is);
if(usernameElem){
usernameElem.innerText = userrname;
}

document.addEventListener("DOMContentLoaded", function() {
  

  user.recall({ sessionStorage: true }, async (ack) => {
    if (ack.err) {
      console.error("Error recalling user:", ack.err);
      // redirect to login page
      window.location.href = "login.html";
    } else if (user.is) {
      const username = user.get("alias").once((alias) => {
        const usernameElem = document.getElementById("username");
        usernameElem.innerText = userrname;
      });
    } else {
      // redirect to login page
      window.location.href = "login.html";
    }
  });

  

//   const logoutButton = document.getElementById("logout-button");
//   if(logoutButton){
//   logoutButton.addEventListener("click", async (event) => {
//     event.preventDefault();
//     user.leave();
//     window.location.href = "login.html";
//   });
// }

//   const createPostButton = document.getElementById("createpost-button");
//   if(createPostButton) {
//   createPostButton.addEventListener("click", async (event) => {
//     event.preventDefault();
//     window.open("createPost.html", '_blank');
//     // window.location.href = ;
//   });
//   }

  ///////////////////// Top Bar ///////

  
  // Get the navbar
var navbar = document.getElementById("header");
if(navbar) {
  // When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};



// Get the offset position of the navbar

var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}
}

///////////////////////////////////

  const posts = gun.get("posts");
  // console.log(user._.soul);
  // const userPublicKey = user.is.pub;
  // console.log(userPublicKey);
  const form = document.querySelector(".form");

  const editform = document.querySelector(".editform"); ////////////// For the form in edit post
  const postContainer = document.querySelector(".posts");

  

  posts.map().on((post, id) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML =  `
    <h2 id="card-title">${post.title}</h2>
    <span id="posted-by">Posted by: ${post.user}</span>
    <span id="posted-at">On: ${post.timestamp}</span>
    
  `;
    postElement.dataset.postId = id; // set the data attribute for the post ID
    if(postContainer){
    postContainer.appendChild(postElement);
    }
  });

  // Add an event listener to each post element
  if(postContainer){
  postContainer.addEventListener("click", (event) => {
    const postElement = event.target.closest(".post");
    if (postElement) {
      const postId = postElement.dataset.postId;
      const postUrl = `http://127.0.0.1:5500/#/Dev-comm/post/${postId}`;
      const newTab = window.open(postUrl, '_blank');
      newTab.addEventListener('load', function() {///////////
      // Retrieve the post content from Gun
  const postRef = gun.get('posts').get(postId);
  postRef.once((post) => {
    const postTitle = post.title;
    const postContent = post.content;
    const postedBy = post.user;
    const postedAt = post.timestamp;


    // Define the function that adds the event listener to the edit button
  function addEditButtonListener() {
    console.log("in function addEditButtonListener");
    

  }



    // Display the post content in the HTML of the new page
    newTab.document.write(`
    <!DOCTYPE html>
      <html>
      
        <head>
          <title>Dev-comm -${postTitle}</title>
          <link rel="stylesheet" href="newtabstyle.css">
          
        </head>
        <body>
  
          
        <div id="header"><span id="PageTitle"> Developer Community </span> </div>
          <div class="post-content">
          <h2 id="post-title">${postTitle}</h2>
          <p id="post-body">
      
          ${postContent}
          </p>
          
          </div>

          <div class="author">
          <h3 id="post-author">${postedBy}</h3>
          <h3 id="post-at">Posted On: ${postedAt}</h3>
          </div>

          
          
          <script>
          
          </script>
        </body>
        
      </html>
    `);
//<button id="editButton">Edit</button>
    //const editPostButton = newTab.document.getElementById("editButton");
    const editPostButton = newTab.document.createElement("button");
    editPostButton.id = "editButton";
    const text = newTab.document.createTextNode("Edit");
    editPostButton.appendChild(text);
    newTab.document.body.appendChild(editPostButton);
          //if(editPostButton) {
            // editPostButton.addEventListener("click", async (event) => {
            //   event.preventDefault();
            //   window.open("editPost.html", '_blank');
            //   // window.location.href = ;
            // });

          //}
          console.log("after const editpostbutton");
          editPostButton.addEventListener("click",  (event) => {
            console.log("in before prevent default");
            event.preventDefault();
            // Open a new tab to edit the post
            console.log("in before url");
            const editUrl = `http://127.0.0.1:5500/#/Dev-comm/edit/${postId}`;
            setTimeout(() => {
            const editTab = window.open(editUrl, '_blank');
            // window.location.href = "login.html";
            // editTab.document.write(`<html><head></head><body>edit</body></html>`);
            console.log(editUrl);
            console.log("after edit tab");
            // Load the edit page with the post data
            editTab.addEventListener("load", () => {
              console.log("in edit tab eventlistener");
              const editTitle = editTab.document.getElementById("editTitle");
              const editContent = editTab.document.getElementById("editPost");
    
              editTitle.value = postTitle;
              editContent.value = postContent;
    
              // Add an event listener to the edit form to handle the submit event
              const editForm = editTab.document.getElementById("editForm");
              editForm.addEventListener("submit", (event) => {
                event.preventDefault();
    
                // Update the post data in Gun
                const updatedTitle = editTitle.value;
                const updatedContent = editContent.value;
    
                postRef.put({ title: updatedTitle, content: updatedContent });
                newTab.close();
                editTab.close();
              });
            });

          }, 1000);
          });


    // Call the function to add the event listener after the button has been added to the DOM
    // console.log("after newtab write");
    // newTab.document.addEventListener("DOMContentLoaded", addEditButtonListener);
    // console.log("after add eventlstener to domcontentloaded");

    // var delayInMilliseconds = 100; //1 second = 1000ms
    // setTimeout(function() {
    //   //your code to be executed after 1 second
      
    //////////////////////////////////////////////////////////////////////////////////////////////
    
          //////////////////////////////////////////////////////////////////////////////////////////////
        // z}, delayInMilliseconds); //end of function

    // const editButton = newTab.document.createElement('button');
    // editButton.innerText = 'Edit';

    
    
    // newTab.document.body.appendChild(editButton);
  });

}); /////new tab event listener


  
    }
  });
}

  ///////////////////// Top Bar ///////

  
  // Get the navbar
  // var footbar = document.getElementById("footer");
  // if(footbar) {
  //   // When the user scrolls the page, execute myFunction
  // window.onscroll = function() {myFunction()};
  
  
  
  // // Get the offset position of the navbar
  
  // var sticky = footbar.offsetTop;
  
  // // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
  // function myFunction() {
  //   if (window.pageYOffset >= sticky) {
  //     footbar.classList.add("sticky")
  //   } else {
  //     footbar.classList.remove("sticky");
  //   }
  // }
  // }

if(form){
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const newTitle = document.querySelector("#newTitle").value;
    //let newPost = document.querySelector("#newPost").value;
    let str;
    const textarea = document.querySelector("#newPost");
    //textarea.addEventListener('input', function() {
      // Get the value of the textarea
      const textareaValue = document.querySelector("#newPost").value;
      // console.log(textareaValue);
      // Replace newlines with HTML line breaks
      const modifiedTextareaValue = textareaValue.replace(/\n/g, "<br>\r\n");
      
      // Store the modified value in the object property
      str = modifiedTextareaValue;
      // console.log(modifiedTextareaValue);
    //});

    // Get the current date and time
    const now = new Date();

    // Format the date and time as a string
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    const newPosst = {
      title: newTitle,
      content: str,
      user: userrname,
      timestamp: timestamp
    };

    var delayInMilliseconds = 100; //1 second = 1000ms

    

    posts.set(newPosst);
    document.querySelector("#newPost").value = "";
    document.querySelector("#newTitle").value = "";

    console.log(newPosst);

    setTimeout(function() {
      //your code to be executed after 1 second
      window.location.href = "index.html";
    }, delayInMilliseconds);

    // window.location.href = "index.html";
  });
}


//////////////////// For the edit update post//////////////////
if(editform){
  editform.addEventListener("submit", (event) => {
    event.preventDefault();
    const editTitle = document.querySelector("#editTitle").value;
    //let newPost = document.querySelector("#newPost").value;
    let str;
    const textarea = document.querySelector("#editPost");
    //textarea.addEventListener('input', function() {
      // Get the value of the textarea
      const textareaValue = document.querySelector("#editPost").value;
      // console.log(textareaValue);
      // Replace newlines with HTML line breaks
      const modifiedTextareaValue = textareaValue.replace(/\n/g, "<br>\r\n");
      
      // Store the modified value in the object property
      str = modifiedTextareaValue;
      // console.log(modifiedTextareaValue);
    //});

    // Get the current date and time
    const now = new Date();

    // Format the date and time as a string
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    const editedPosst = {
      title: editTitle,
      content: str,
      user: userrname,
      timestamp: timestamp
    };

    var delayInMilliseconds = 100; //1 second = 1000ms

    

    posts.set(editedPosst);
    document.querySelector("#newPost").value = "";
    document.querySelector("#newTitle").value = "";

    console.log(newPosst);

    setTimeout(function() {
      //your code to be executed after 1 second
      window.location.href = "index.html";
    }, delayInMilliseconds);

    // window.location.href = "index.html";
  });
}

});
/* <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-...';"></meta> */

/* <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline';"></meta> */