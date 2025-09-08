<div id="boostModal" class="boostModal none">

    <!-- Step 1 -->
    <div class="modal-step" data-step="1">
      <img src="svg/adPost.svg" alt="Boost">
      <h2 class="xxl_font_size">Ready to shine?</h2>
      <p class="md_font_size">Your post will go to the top of the feed.<br>Once confirmed, it can’t be cancelled.</p>
      <div class="modal-footer">
        <div class="button btn-transparent close-btn">Cancel</div>
        <div class="button btn-blue next-btn">Promote</div>
      </div>
    </div>

    <!-- Step 2 -->
    <div class="modal-step" data-step="2">
      <h2 class="xxl_font_size">Pinned post configuration </h2>  
      <div class="boostDiv">
        <div class="boostPost_left">
            <p class="bold md_font_size">Preview</p>
            <!-- Replace the <img> with the full card -->
            <div id="preview_boostedPost" class="preview_boostedPost card"></div>
        </div>

        <div class="boostPost_right">
            <p>Ad duration:</p>
            <div class="adDurationInfos">
                <span class="start">Start</span>
                <span class="immediately">Immediately</span>
            </div>
            <div class="adDurationInfos">
                <span class="duration">Duration</span>
                <span class="hours">24 hours</span>
            </div>
            <div class="margin_bottom_0 adDurationInfos">
                <span class="shown">Shown</span>
                <span class="top_feed">Top of the feed</span>
            </div>
            <p>Pricing:</p>
            <div class="adDurationInfos">
                <span class="total_cost">Total cost</span>
                <span class="bold price">2 000 <img src="svg/logo_sw.svg" alt="peer logo"></span>
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <div class="button btn-transparent back-btn">Back</div>
        <div class="button btn-blue next-btn">Next</div>
      </div>
    </div>

    <!-- Step 3 -->
    <div class="modal-step" data-step="3">
      <h2 class="xxl_font_size">Pricing & Cost breakdown</h2>  
      <div class="available_tokens_breakdown">
        <div class="available_tokens">Available tokens</div>
        <div class="container"><span id="token_balance" class="bold xxl_font_size token_balance"></span><img src="svg/logo_sw.svg" alt="peer logo"></div>
      </div>
      <div class="pricing_breakdown">
        <div class="boostPost_left">
            <p class="">Payable tokens for ad</p>
            <span class="bold xxxl_font_size price">2 000 <img src="svg/logo_sw.svg" alt="peer logo"></span>
        </div>
         <!-- Vertical Divider -->
        <div class="vr"></div>
        <div class="boostPost_right">
            <p>Token distribution</p>
            <div class="token_distribution">
                <span class="total_cost">96% Burn pccount </span>
                <span class=" price"><img src="svg/logo_sw.svg" alt="peer logo">1 536 </span>
            </div>
            <div class="token_distribution">
                <span class="total_cost bold">1% @wosk_kolloin</span>
                <span class=" price"><img src="svg/logo_sw.svg" alt="peer logo">16 </span>
            </div>
            <div class="token_distribution">
                <span class="total_cost">1% Liquidity pool</span>
                <span class=" price"><img src="svg/logo_sw.svg" alt="peer logo">16 </span>
            </div>
            <div class="token_distribution">
                <span class="total_cost">2% Peer bank</span>
                <span class=" price"><img src="svg/logo_sw.svg" alt="peer logo">32 </span>
            </div>
        </div>
      </div>
      <p class="ad_message">All set! Your ad is ready to go - click 'Pay' to lunch your ad.</p>
      <div class="modal-footer">
        <div class="button btn-transparent back-btn"><img src="" alt="">Back</div>
        <div class="button btn-blue next-btn">Pay</div>
      </div>
    </div>

    <!-- Step 4 --> 
    <div class="modal-step" data-step="4">
      <img src="svg/confirmIcon.svg" alt="Confirmed">
      <h2 class="xxl_font_size">Your post promotion has started.</h2>
      <p class="md_font_size">Your post is now pinned and will expire on <br><span class="bold">Jun 25, 2025 at 14:30 </span> (24 hours from now)</p>
      <div class="modal-footer">
        <div class="button btn-transparent goToProfile-btn">Go to profile</div>
        <div class="button btn-blue goToPost-btn">Go to post</div>
      </div>
    </div>

</div>
