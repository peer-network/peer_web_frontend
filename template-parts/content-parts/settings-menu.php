<div class="setting-menu">
  <ul>
    <li class="active" data-target="profile-settings"><a href="#" class="md_font_size">Profile Settings</a></li>
    <li data-target="notification-settings"><a href="#" class="md_font_size">Notification Settings</a></li>
    <li data-target="prefrences"><a href="#" class="md_font_size">Prefrences</a></li>
    <li data-target="content-settings"><a href="#" class="md_font_size">Content Settings</a></li>

    <li class="not-menu-item"><a href="#" id="logOut" class="md_font_size red-btn">Log Out</a></li>
    <li class="not-menu-item"><a href="#" id="deactivateProfile" class="md_font_size red-btn">Deactivate profile</a></li>


   
    
  </ul>
  <div id="modalOverlay" class="modal-overlay none">
           <div class="logOut-pop" id="logOutPop">
             <img src="svg/Union.svg" alt="logout">
             <p class="xl_font_size bold">Are you sure you want to log out?</p>
             <div class="button-row">
               <button id="cancelLogoutBtn" class="btn-white">Cancel</button>
               <button id="confirmLogoutBtn" class="btn-red-transparent">Log Out</button>
             </div>
           </div>
         </div>
</div>