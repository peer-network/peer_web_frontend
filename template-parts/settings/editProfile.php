 <div id="profile-settings" class="setting-content">
   <div id="change-pic-bio" class="profile-widget active">
     <div class="edit-profile">
       <div class="profile_picture">
         <div class="cropContainer">
           <span class="online_status"></span>
           <img id="myprofilbild" class="profile-picture my-profile-picture" src="svg/noname.svg"
             alt="Profile Picture" />
         </div>
         <a href="#" id="change-picture" class="button change-picture">Change Picture</a>
         <div class="none"> <input type="file" id="fileInput" accept="image/*" /></div>
       </div>
       <div class="profile-fields">
         <div class="input-field transparent">
           <label>Description</label>
           <textarea cols="40" rows="5" maxlength="5000" class="input-textarea" id="biography"
             name="profile-description" placeholder="Write a description to your profile..."></textarea>
         </div>
         <div id="response_msg_bio" class="response_msg"></div>
         <div class="input-field username-row transparent">
           <label>Username</label>
           <span>@<span id="pusername">&nbsp;</span></span>
           <a href="#" id="changeusernamebtn">Change</a>
         </div>
       </div>
       <button id="saveprofileBtn" class=" full-width-btn btn-white">Save Changes</button>
     </div>
     <div class="profile-setting-buttons">
       <div class="change-password-email">
         <a id="changePassbtn" href="#" class="button change-pass-btn btn-transparent">Change
           password</a>
         <a id="changeEmailbtn" href="#" class="button change-email-btn btn-transparent">Change
           e-mail</a>
       </div>
       
     </div>
     <div id="imageModal" class="modal">
       <div class="modal-content">
         <span class="closeBtn"> <img src="svg/close.svg" alt="Close" /></span>
         <h2 class="modal-content-heading">Preview</h2>
         <div class="image-preview-wrapper">
           <img id="previewImage" src="" alt="Preview" />
         </div>
         <div class="img-zoom">
           <label>Zoom</label>
           <input type="range" id="zoomSlider" min="1" max="3" step="0.1" value="1" />
         </div>
         <div class="button-row">
           <button id="cancelBtn" class="btn-transparent">Cancel</button>
           <button id="applyBtn" class="btn-blue">Apply</button>
         </div>
       </div>
     </div>
   </div>
   <div id="change-username" class="profile-widget">
     <div class="edit-profile change-username">
       <h2 class="section_heading">Change username</h2>
       <form id="changeusernameForm" class="form-container">
         <div class="profile-fields">
           <div class="input-field">
             <input type="text" id="newusername" name="username" class="input-text" placeholder="Enter new username"
               required="">
           </div>
           <div class="input-field">
             <input type="password" id="userPassword" name="password" placeholder="Enter password" required=""
               class="input-text">
           </div>
         </div>
         <div id="response_msg_change_username" class="response_msg"></div>
         <button id="changeUserBtn" class="save-btn full-width-btn " disabled=true>Submit</button>
       </form>
     </div>
   </div>
   <div id="change-password" class="profile-widget">
     <div class="edit-profile change-password">
       <h2 class="section_heading">Change password</h2>
       <form id="changepasswordForm" class="form-container">
         <div class="profile-fields">
           <div class="input-field">
              <img class="password-icon" src="svg/lock1.svg" alt="">
             <input type="password" id="old_password" name="old_password" class="input-text test"
               placeholder="Enter old password" required="">
           </div>
           <!-- Password Component -->
           <div class="password-component" data-show-strength="true" data-show-message="false" data-name="password"></div>
           <!-- Confirm Password Component -->
           <div class="confirm-password-component" data-name="confirm_password"></div>
         </div>
         <button id="changePasswordBtn" class="save-btn full-width-btn ">Submit</button>
       </form>
     </div>
   </div>
   <div id="change-email" class="profile-widget">
     <div class="edit-profile change-email">
       <h2 class="section_heading">Change e-mail</h2>
       <form id="changeemailForm" class="form-container">
         <div class="profile-fields">
           <div class="input-field">
             <input type="email" id="new_email" name="new_email" class="input-text" placeholder="Enter new e-mail"
               required="">
           </div>
           <div class="input-field">
             <input type="password" id="yourpassword" name="yourpassword" placeholder="Enter password" required=""
               class="input-text">
           </div>
         </div>
         <div id="response_msg_change_email" class="response_msg"></div>
         <button id="changeEmailBtn" class="save-btn full-width-btn ">Submit</button>
       </form>
     </div>
   </div>
 </div>