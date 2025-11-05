<!DOCTYPE html>
<html lang="de">
<?php require_once ('./template-parts/head.php'); ?>
<body>
    <div id="moderation" class="site_layout">
        <?php require_once ('./template-parts/header.php'); ?>

        <main class="site-main site-main-admin">
            
           <div class="content_box">
            <div class="content_box_left">

            </div>

             <div class="content_box_right">
                <div class="conten_status">
                    <span class="label xl_font_size txt-color-gray">Status</span>    
                    <span class="review xl_font_size yellow-text">Waiting for review</span>
                </div>

                <div class="reported_by">
                    <div class="head">
                        <span class="label xl_font_size">Reported by</span>    
                        <span class="flag xl_font_size red-text"><i class="peer-icon peer-icon-copy-alt"></i> 5 </span>
                    </div>
                    <div class="reported_by_profiles">
                        <div class="profile_item">
                            <div class="profile">
                                <span class="profile_image">
                                    <img src="../img/profile_thumb.png" /> 
                                </span>
                                <span class="profile_detail">
                                    <span class="user_name xl_font_size bold italic">valaria_konso</span>
                                    <span class="user_slug txt-color-gray">#123456</span>
                                </span>
                            </div>
                            <div class="report_time xl_font_size txt-color-gray">
                                20 Jun 2025, 15:03
                            </div>
                        </div>

                        <div class="profile_item">
                            <div class="profile">
                                <span class="profile_image">
                                    <img src="../img/profile_thumb.png" /> 
                                </span>
                                <span class="profile_detail">
                                    <span class="user_name xl_font_size bold italic">valaria_konso</span>
                                    <span class="user_slug txt-color-gray">#123456</span>
                                </span>
                            </div>
                            <div class="report_time xl_font_size txt-color-gray">
                                20 Jun 2025, 15:03
                            </div>
                        </div>


                        <div class="profile_item">
                            <div class="profile">
                                <span class="profile_image">
                                    <img src="../img/profile_thumb.png" /> 
                                </span>
                                <span class="profile_detail">
                                    <span class="user_name xl_font_size bold italic">valaria_konso</span>
                                    <span class="user_slug txt-color-gray">#123456</span>
                                </span>
                            </div>
                            <div class="report_time xl_font_size txt-color-gray">
                                20 Jun 2025, 15:03
                            </div>
                        </div>
                    </div>

                </div>

                <div class="action_buttons">
                    <a class="button btn-blue bold" href="#">Restore</a>
                    <a class="button btn-transparent" href="#">Hide</a>
                    <a class="button btn-red-transparent" href="#">Mark as illegal</a>
                </div>

            </div>

           </div>
           

            
        </main>


        <?php require_once ('./template-parts/footer.php'); ?>
    </div>

</body>
</html>