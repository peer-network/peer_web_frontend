<div id="feebackPopup" class="modal-overlay none" role="dialog" aria-labelledby="feedback-title" aria-modal="true">
    <div class="feeback_popup_container">
        <button class="close xl_font_size btn" type="button" aria-label="Close feedback popup">
            <i class="peer-icon peer-icon-cancel" aria-hidden="true"></i>
        </button>
        <img src="<?= $baseUrl ?>/svg/PeerLogoWhite.svg" alt="Peer logo">
        <p id="feedback-title" class="xxl_font_size blod">Got thoughts or ideas?</p>
        <p class="xl_font_size">Tap the button below to share your feedback.</p>
        <div class="button-row">

            <a class="button btn-transparent"
                href="https://docs.google.com/forms/d/e/1FAIpQLSeTRecbfUTKmpYHSaE7bSawEagUpkOPagJtLqZdsec659HaGw/viewform"
                target="_blank"
                aria-label="Share feedback, opens in new tab">
                Share feedback
                <i class="peer-icon peer-icon-comment-dot"></i>
            </a>
        </div>
        <p class="md_font_size txt-color-gray">"Share Feedback" option is always under the right menu.</p>
        <div class="dont_show_row"> 
            <label for="dont_show_feedbackPopup" class="form-control xl_font_size txt-color-gray">Do not show this message again 
                <input id="dont_show_feedbackPopup" type="checkbox" name="dont_show_feedbackPopup" value="" /> 
            </label>
        </div>
    </div>
</div>
<?php require_once('./template-parts/content-parts/onboarding.php'); ?>
<footer></footer>