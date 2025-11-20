<!DOCTYPE html>
<html lang="de">
<?php require_once ('./template-parts/head.php'); ?>
<body>
    <div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
    
    <div id="moderation" class="site_layout">
        <?php require_once ('./template-parts/header.php'); ?>

        <main class="site-main site-main-admin">
            <h2 class="xxl_font_size mb-xl">Content moderation</h2>
            <div class="main_stats">
                <div class="stat_box review">
                    <span class="stat_head xl_font_size">Awaiting Review <i class="peer-icon peer-icon-warning yellow-text"></i></span>
                    <span class="stat_count xxl_font_size bold">30</span>
                    <span class="stat_desc txt-color-gray">Requires immediate attention</span>

                </div>
                <div class="stat_box hidden-st">
                    <span class="stat_head xl_font_size">Hidden <i class="peer-icon peer-icon-eye-close red-text"></i></span>
                    <span class="stat_count xxl_font_size bold">25</span>
                    <span class="stat_desc txt-color-gray">Currently not visible to users</span>
                </div>
                <div class="stat_box restored">
                    <span class="stat_head xl_font_size">Restored <i class="peer-icon peer-icon-good-tick-circle green-text"></i></span>
                    <span class="stat_count xxl_font_size bold">75</span>
                    <span class="stat_desc txt-color-gray">Reviewed and restored</span>
                </div>
                <div class="stat_box illegal">
                    <span class="stat_head xl_font_size">Illegal <i class="peer-icon peer-icon-cross-circle red-text"></i></span>
                    <span class="stat_count xxl_font_size bold">25</span>
                    <span class="stat_desc txt-color-gray">Never shows to users</span>
                </div>
            </div>

            <div class="content_result">

                <div class="content_filter_row">
                    <div class="content_filter xl_font_size">
                        <ul>
                            <li class="all"><a href="#" class="active"><span>All</span></a></li>
                            <li class="post"><a href="#"><span>Post</span></a></li>
                            <li class="comments"><a href="#"><span>Comments</span></a></li>
                            <li class="accounts"><a href="#"><span>Accounts</span></a></li>
                        </ul>

                    </div>
                    <div class="waiting_review_filter">
                        <label for="review_chk">Waiting for review <input type="checkbox"  id="review_chk" name="review" /></label>

                    </div>
                </div>

                <div class="content_list">
                    <div class="content_item head">
                        <div class="content xl_font_size txt-color-gray">Content</div>
                        <div class="moderation_id xl_font_size txt-color-gray">Moderation ID</div>
                        <div class="moderation_date xl_font_size txt-color-gray">Moderation date</div>
                        <div class="reports xl_font_size txt-color-gray">Reports</div>
                        <div class="status xl_font_size txt-color-gray">Status</div>
                    </div>
                
                
                    <div class="content_item post">
                        <div class="content">
                            <span class="content_image">
                                <img src="../img/audio-bg.png" />
                                <i class="peer-icon peer-icon-camera"></i>
                            </span>
                            <span class="content_detail">
                                <span class="user_name bold italic">@scammer_idiot</span>
                                <span class="post_title xl_font_size bold">Rejected at the gates...</span>
                                

                            </span>
                        </div>
                        <div class="moderation_id xl_font_size txt-color-gray">#124582687163813253732687</div>
                        <div class="moderation_date xl_font_size txt-color-gray">20 Jun 15:03</div>
                        <div class="reports">
                            <span class=" xl_font_size txt-color-gray"><i class="peer-icon peer-icon-copy-alt"></i> 1 </span>
                            <span class="visible txt-color-gray"><i class="peer-icon peer-icon-eye-close"></i> Not visible in the feed</span>
                        </div>
                        <div class="status">
                            <span class="hidden-tx xl_font_size red-text">Hidden</span>
                            
                        </div>
                    </div>


                    <div class="content_item user">
                        <div class="content">
                            <span class="content_image">
                                <img src="../img/profile_thumb.png" />
                                
                            </span>
                            <span class="content_detail">
                                <span class="user_name xl_font_size bold italic">valaria_konso</span>
                                <span class="user_slug txt-color-gray">#123456</span>

                            </span>
                        </div>
                        <div class="moderation_id xl_font_size txt-color-gray">#124582687163813253732687</div>
                        <div class="moderation_date xl_font_size txt-color-gray">20 Jun 15:03</div>
                        <div class="reports">
                            <span class=" xl_font_size txt-color-gray"><i class="peer-icon peer-icon-copy-alt"></i> 1 </span>
                            <span class="visible txt-color-gray"><i class="peer-icon peer-icon-eye-close"></i> Not visible in the feed</span>
                        </div>
                        <div class="status">
                            <span class="restored xl_font_size green-text">Restored</span>
                        </div>
                    </div>

                    <div class="content_item comment">
                        <div class="content">
                            <span class="content_image">
                               <i class="peer-icon peer-icon-comment-fill"></i>
                                
                            </span>
                            <span class="content_detail">
                                <span class="user_name  bold italic">@scammer_idiot</span>
                                <span class="post_title xl_font_size bold">Rejected at the gates...</span>
                                <span class="user_slug txt-color-gray">2f1f96ec-f60e-4f05-b3fd-d3444c7cd74d</span>

                            </span>
                        </div>
                        <div class="moderation_id xl_font_size txt-color-gray">#124582687163813253732687</div>
                        <div class="moderation_date xl_font_size txt-color-gray">20 Jun 15:03</div>
                        <div class="reports">
                            <span class=" xl_font_size txt-color-gray"><i class="peer-icon peer-icon-copy-alt"></i> 1 </span>
                            <span class="visible txt-color-gray"><i class="peer-icon peer-icon-eye-close"></i> Not visible in the feed</span>
                        </div>
                        <div class="status">
                             <span class="review xl_font_size yellow-text">Waiting for review</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <?php require_once ('./template-parts/footer.php'); ?>
    </div>
</body>
</html>