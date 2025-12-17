<?php
require_once '../host.php';
require_once '../auth.php';

checkAuth("unauthorized");
enforceAdminRole($domain ?? ($_SERVER['HTTP_HOST'] ?? ''), 'https');
?>
<!DOCTYPE html>
<html lang="de">
<?php require_once ('./template-parts/head.php'); ?>
<body>
    <div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
    <div id="moderation" class="site_layout">
        <?php require_once ('./template-parts/header.php'); ?>

        <main class="site-main site-main-admin">
            
           <div class="content_box">
            <div class="content_box_left">
                <!--- Content type : Post --->
                <div class="content_type_post">
                    <div class="profile_post">
                        <div class="profile">
                            <span class="profile_image">
                                <img src="../img/profile_thumb.png" /> 
                            </span>
                            <span class="profile_detail">
                                <span class="user_name xl_font_size bold italic">valaria_konso</span>
                                <span class="user_slug txt-color-gray">#123456</span>
                            </span>
                        </div>
                        <div class="fullpost_link">
                            <a class="button btn-transparent" href="#">See full post <i class="peer-icon peer-icon-arrow-right"></i></a>
                        </div>
                    </div>
                    <div class="post_detail">
                        <div class="post_title">
                            <h2 class="xxl_font_size bold">Rejected at the gates of techno heaven:  Berghain > Mars? </h2>
                            <span class="timeagao txt-color-gray">2h</span>

                        </div>
                        <div class="post_text">
                            Hier würde man jz die description reinschreiben. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget justo id arcu interdum facilisis id a purus. Nulla facilisi. Integer auctor, ligula a viverra scelerisque, felis lorem lacinia nunc, a malesuada nisi sapien sit amet ligula. Curabitur fermentum turpis in sapien vulputate, vel laoreet. Lacus tincidunt. Donec gravida orci at elit consequat, vel vestibulum lorem dapibus. Praesent faucibus est vitae est egestas, sit amet laoreet mi tincidunt. ...
                        </div>

                        <div class="hashtags txt-color-blue"><span class="hashtag">#cool</span><span class="hashtag">#khalidpost</span><span class="hashtag">#khalid</span></div>

                    </div>
                </div>
                <!--- End Content type : Post  --->


                <!--- Content type : Profile --->
                <div class="content_type_profile">
                    <div class="profile">
                        <div class="profile_image">
                            <img src="../img/profile_thumb.png" /> 
                        </div>
                        <div class="profile_detail">
                            <div class="user_info">
                                <span class="user_name xl_font_size bold italic">valaria_konso</span>
                                <span class="user_slug txt-color-gray">#123456</span>
                            </div>
                            <div class="user_profile_txt txt-color-gray">Curating my little corner of the internet | 📷 Film lover | ☕️ Flat white enthusiast  🌿 Finding beauty in the small things</div>

                            <div class="profile_stats txt-color-gray">
                                <span class="post_count">
                                    <em id="userPosts" class="xl_font_size bold">102</em> Publications
                                </span> 
                                <span id="followers_count" class="followers_count">
                                    <em id="followers" class="xl_font_size bold">12</em> Followers
                                </span> 
                                <span id="following_count" class="following_count">
                                    <em id="following" class="xl_font_size bold">10</em> Following
                                </span> 
                                <span id="peer_count" class="peer_count">
                                    <em id="peers" class="xl_font_size bold">5</em> Peers
                                </span> 
                            </div>
                        
                        </div>
                    </div>
                    <div class="profile_link">
                         <a class="button btn-transparent" href="#">View profile <i class="peer-icon peer-icon-arrow-right"></i></a>
                    </div>

                </div>
                <!--- End Content type : Profile  --->

                <!--- Content type : Comment --->
                <div class="content_type_comment">
                    <div class="comment_box">
                        <h2 class="xxl_font_size bold"><i class="peer-icon peer-icon-comment-fill xl_font_size"></i> Reported comment</h2>

                        <div class="comment_item">
                            <div class="commenter-pic">
                                <img class="profile-picture" src="../img/profile_thumb.png" alt="user image">
                            </div>
                            <div class="comment_body">
                                <div class="commenter_info xl_font_size">
                                    <span class="cmt_userName bold italic">Bryan Johnson</span>
                                    <span class="cmt_profile_id txt-color-gray">#93268</span>
                                    <span class="timeagao txt-color-gray">3m</span>
                                </div>
                                <div class="comment_text xl_font_size">Optimizing our biological systems isn't just a goal - it's a responsibility to unlock the best version of ourselves.</div>
                            
                            </div>
                            <div class="comment_like xl_font_size">
                                <i class="peer-icon peer-icon-like"></i>
                                <span>0</span>
                            </div>
                        </div>
                    </div>

                    <div class="comment_post_detail">
                        <div class="profile_post">
                            <div class="profile">
                                <span class="profile_image">
                                    <img src="../img/profile_thumb.png" /> 
                                </span>
                                <span class="profile_detail">
                                    <span class="user_name xl_font_size bold italic">valaria_konso</span>
                                    <span class="user_slug txt-color-gray">#123456</span>
                                </span>
                            </div>
                            <div class="fullpost_link">
                                <a class="button btn-transparent" href="#">See full post <i class="peer-icon peer-icon-arrow-right"></i></a>
                            </div>
                        </div>
                        <div class="post_detail">
                            <div class="post_media">
                            
                            </div>
                            <div class="post_info">
                                <div class="post_title">
                                    <h2 class="xl_font_size bold">Rejected at the gates of techno heaven:  Berghain > Mars? </h2>
                                    <span class="timeagao txt-color-gray">2h</span>

                                </div>
                                <div class="post_text">
                                    Hier würde man jz die description reinschreiben. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget justo id arcu interdum facilisis id a purus. Nulla facilisi. Integer auctor, ligula a viverra scelerisque, felis lorem lacinia nunc, a malesuada nisi sapien sit amet ligula. Curabitur fermentum turpis in sapien vulputate, vel laoreet. Lacus tincidunt. Donec gravida orci at elit consequat, vel vestibulum lorem dapibus. Praesent faucibus est vitae est egestas, sit amet laoreet mi tincidunt. ...
                                </div>

                                <div class="hashtags txt-color-blue">
                                    <span class="hashtag">#cool</span>
                                    <span class="hashtag">#khalidpost</span>
                                    <span class="hashtag">#khalid</span>
                                </div>
                             </div>

                        </div>
                    </div>
                </div>
                <!--- End Content type : Comment  --->


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
             
                <!--- Action Boxes --->
                <div class="action_buttons">
                    <a class="button btn-blue bold" href="#">Restore</a>
                    <a class="button btn-transparent" href="#">Hide</a>
                    <a class="button btn-red-transparent" href="#">Mark as illegal</a>
                </div>

                <div class="action_box action_restore none">
                    <div class="action_info">
                        <h3 class="xl_font_size bold">Are you sure you want to restore this content?</h3>
                        <p class="txt-color-gray">It will reappear in everyone’s feed</p>
                    </div>
                    <div class="action_buttons">
                        <a class="button btn-transparent" href="#">No</a>
                        <a class="button btn-white" href="#">Yes</a>
                    </div>
                </div>

                <div class="action_box action_illegal none">
                    <div class="action_info">
                        <h3 class="xl_font_size bold red-text">Are you sure this content is illegal?</h3>
                        <p class="txt-color-gray">It will not be shown to anyone ever without possibility to restore.</p>
                    </div>
                    <div class="action_buttons">
                        <a class="button btn-transparent" href="#">No</a>
                        <a class="button btn-white" href="#">Yes</a>
                    </div>
                </div>

                <div class="action_box action_hide none">
                    <div class="action_info">
                        <h3 class="xl_font_size bold">Are you sure you want to hide this content?</h3>
                        <p class="txt-color-gray">It will require additional confirmation from users to be shown.</p>
                    </div>
                    <div class="action_buttons">
                        <a class="button btn-transparent" href="#">No</a>
                        <a class="button btn-white" href="#">Yes</a>
                    </div>
                </div>
                <!--- End Action Boxes --->

                <!--- Moderated Boxes --->
                <div class="moderated_by_box none">
                    <div class="moderated_info">
                        <span class="label xl_font_size txt-color-gray">Moderated by</span>
                        <span class="profile">
                            <span class="profile_image">
                                <img src="../img/profile_thumb.png" /> 
                            </span>
                            <span class="profile_detail">
                                <span class="user_name xl_font_size bold italic">valaria_konso</span>
                                <span class="user_slug txt-color-gray">#123456</span>
                            </span>

                        </span>
                        <span class="datetime xl_font_size txt-color-gray">24 Jun 2025, 09:15</span>
                    </div>

                    <div class="moderated_action xl_font_size green-text">Restored</div>

                </div>

                <!--- End Moderated Boxes --->

            </div>
            

           </div>
           
           <div class="svg_bg">
                <svg xmlns="http://www.w3.org/2000/svg" width="3214" height="1332" viewBox="0 0 3214 1332" fill="none">
                <g filter="url(#filter0_f_17482_256514)">
                    <path d="M2534 1330.6C2534 1690.41 2013.53 1982.1 1371.5 1982.1C729.469 1982.1 209 1690.41 209 1330.6C209 970.786 729.469 679.1 1371.5 679.1C2013.53 679.1 2534 970.786 2534 1330.6Z" fill="#77AFFF" fill-opacity="0.07"/>
                </g>
                <defs>
                    <filter id="filter0_f_17482_256514" x="-470.1" y="0" width="3683.2" height="2661.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feGaussianBlur stdDeviation="339.55" result="effect1_foregroundBlur_17482_256514"/>
                    </filter>
                </defs>
                </svg>
            </div>
        </main>

        <?php require_once ('./template-parts/footer.php'); ?>
    </div>

</body>
</html>