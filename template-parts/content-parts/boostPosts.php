<div id="boostModal" class="boostModal none">

    <!-- Step 1 -->
    <div class="modal-step" data-step="1">
      <img src="svg/adPost.svg" alt="Boost">
      <h2 class="xxl_font_size">Ready to shine?</h2>
      <p class="md_font_size">Your post will go to the top of the feed.<br>Once confirmed, it can’t be cancelled.</p>
      <div class="modal-footer">
        <div class="button btn-transparent close-btn">Cancel</div>
        <div class="button btn-blue next-btn bold">Promote</div>
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
            <p class="md_font_size">Ad duration:</p>
            <div class="adDurationInfos">
                <span class="start txt-color-gray">Start</span>
                <span class="immediately">Immediately</span>
            </div>
            <div class="adDurationInfos">
                <span class="duration txt-color-gray">Duration</span>
                <span class="hours">24 hours</span>
            </div>
            <div class="margin_bottom_0 adDurationInfos">
                <span class="shown txt-color-gray">Shown</span>
                <span class="top_feed">Top of the feed</span>
            </div>
            <p class="md_font_size total_cost_head">Pricing:</p>
            <div class="adDurationInfos">
                <span class="total_cost txt-color-gray">Total cost</span>
                <span class="bold price xl_font_size"><span class="total_cost">200</span> <img src="svg/logo_sw.svg" alt="peer logo"></span>
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <div class="button btn-transparent back-btn">Back</div>
        <div class="button btn-blue next-btn bold">Next</div>
      </div>
    </div>

    <!-- Step 3 -->
    <div class="modal-step" data-step="3">
      <h2 class="xxl_font_size">Pricing & Cost breakdown</h2>  
      <div class="modal-body">
        <div class="available_tokens_breakdown">
          <div class="available_tokens md_font_size">Available tokens</div>
          <div class="available_tokens_amount"><span id="token_balance" class="bold xxl_font_size token_balance"></span><img src="svg/logo_sw.svg" alt="peer logo"></div>
        </div>
        <div class="pricing_breakdown">
          <div class="boostPost_left">
              <p class="xl_font_size">Payable tokens for ad</p>
              <span class="bold xxxl_font_size price">200 <img src="svg/logo_sw.svg" alt="peer logo"></span>
          </div>
          <!-- Vertical Divider -->
          <div class="vr"></div>
          <div class="boostPost_right">
              <p class="xl_font_size">Token distribution</p>
              <div class="token_distribution">
                  <span class="total_cost">Peer Bank (2%)</span>
                  <span class="price"><img src="svg/logo_sw.svg" alt="peer logo">4</span>
              </div>
              <div class="token_distribution none">
                  <span class="total_cost bold">1% <em>@wosk_kolloin</em></span>
                  <span class="price"><img src="svg/logo_sw.svg" alt="peer logo">16 </span>
              </div>
              <div class="token_distribution">
                  <span class="total_cost">To the inviter (1%)</span>
                  <span class="price"><img src="svg/logo_sw.svg" alt="peer logo">2</span>
              </div>
              <div class="token_distribution">
                  <span class="total_cost">Burn (1%)</span>
                  <span class="price"><img src="svg/logo_sw.svg" alt="peer logo">2</span>
              </div>
          </div>
        </div>
        <p class="ad_message md_font_size">All set! Your ad is ready to go - click 'Pay' to lunch your ad.</p>
      </div>
      <div class="modal-footer">
        <div class="button btn-transparent back-btn"><img src="" alt="">Back</div>
        <div class="button btn-blue next-btn bold" id="advertisePost">Pay</div>
      </div>
    </div>

    <!-- Step 4 --> 
    <div class="modal-step" data-step="4">
      <div class="modal-body">
        <img src="svg/confirmIcon.svg" alt="Confirmed">
        <h2 class="xxl_font_size">Your post promotion has started.</h2>
        <p class="md_font_size">Your post is now pinned and will expire on <br><span class="bold" id="adPostCreatedAtTime">Jun 25, 2025 at 14:30 </span> (24 hours from now)</p>
       </div>
      <div class="modal-footer">
        <div class="button btn-transparent goToProfile-btn">Go to profile</div>
        <div class="button btn-blue goToPost-btn bold">Go to post</div>
      </div>
    </div>
</div>
