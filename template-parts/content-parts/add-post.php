<div class="create_post">
    <div class="inner-container">
        <form id="create_new_post" class=" resettable-form" method="post" data-post-type="text">
            <div id="preview-image" class="upload">
                <div class="drop-preview-area preview-container">
                    <div  class="image-preview-container">
                        <span class="button nav-button prev-button none"><i class="fi fi-rr-angle-left"></i></span>
                        <div class="preview-track-wrapper">
                            <div class="preview-track">
                                <!-- JS will insert .preview-item divs here -->
                            </div>
                        </div>

                        <span class="button nav-button next-button none"><i class="fi fi-rr-angle-right"></i></span>
                    </div>
                    <div id="drop-area-image" class="drop-area">
                        <div class="plus-icon"><i class="fi fi-sr-plus"></i></div>
                        <span class="upload-label">Upload Images</span>
                        <input type="file" id="file-input-image" accept=".png, .jpg, .jpeg, .gif, .webp" hidden  multiple />
                    </div>
                    

                </div>
                <div class="images_action_buttons">
                    <div id="aspectRatioSelectMulti" class="aspect-ratio-toggle">
                        <input type="radio" id="ar-12" name="aspectRatioMul" value="1" checked>
                        <label for="ar-12">1:1 Square</label>
                        <input type="radio" id="ar-22" name="aspectRatioMul" value="0.8">
                        <label for="ar-22">4:5 Vertical</label>
                    </div>
                    
                    <div id="more-images_upload" >
                        <div class="plus-icon"><i class="fi fi-sr-plus"></i></div>
                        <span class="upload-label">Upload more images</span>
                    </div>
                </div>
                <span class="response_msg error" id="imageError"></span>

            </div>
            <div id="preview-audio" class="upload">
                <div class="form-row">
                    <div class="col-left">
                        <div id="drop-area-audio" class="drop-area">
                            <div class="plus-icon"><i class="fi fi-sr-plus"></i></div>
                          <span class="upload-label">Upload .mp3, .wav, .flac, .aac, m4a</span>
                            <input type="file" id="file-input-audio" accept=".mp3, .wav, .flac, .aac, .m4a" hidden />
                        </div>
                    </div>
                    <div class="col-right">
                        <div id="voice-record-wrapper" class="voice-media">
                            <div class="audiobackground_uploader none">
                                <div id="drop-area-audiobackground"  class="drop-area drop-area-audiobackground">
                                    <div class="upload-content">
                                        <div class="plus-icon"><i class="fi fi-sr-plus"></i></div>
                                        <span class="upload-label">Choose background image</span>
                                    </div>
                                    <input type="file" id="file-input-audiobackground" accept=".png, .jpg, .jpeg, .gif, .webp" hidden />
                                </div>
                                <div id="audio-cover-image-preview" ></div>
                            </div>

                            
                            <div class="recodring-block">
                                <span id="recordingStatusText" class="md_font_size txt-color-gray">Start recording</span>
                                 <!-- Voice Bar -->
                                    <div class="visualizer-wrapper">
                                    <?php require_once('./template-parts/content-parts/voice-bar-svg.php'); ?>
                                    </div>
                                <!-- mic icon svg -->
                                <div class="micButton">
                                    <span class="icon-mic none" id="voice-media-off">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="65" height="65" viewBox="0 0 65 65"
                                            fill="none">
                                            <path
                                                d="M59.4721 38.8339C64.6339 36.2592 64.641 28.8966 59.4842 26.312L11.1378 2.0804C6.48316 -0.252548 1.00137 3.13165 1.00126 8.33821L1.00024 56.6856C1.00013 61.8864 6.47075 65.2712 11.1247 62.9498L59.4721 38.8339Z"
                                                fill="white" stroke="white" stroke-width="2" stroke-linejoin="round" />
                                        </svg>
                                    </span>

                                    <span class="icon-mic" id="voice-media-steady">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="82" height="104" viewBox="0 0 82 104"
                                            fill="none">
                                            <rect x="22.3145" y="3.5" width="37.4444" height="59.6765" rx="18.7222"
                                                stroke="white" stroke-width="7" stroke-linecap="round" />
                                            <path
                                                d="M37.5371 99.9999V82.3603C16.7879 80.5857 0.5 63.1843 0.5 41.9755V40.7421C0.5 38.8091 2.067 37.2421 4 37.2421C5.933 37.2421 7.5 38.8091 7.5 40.7421V41.9755C7.5 60.4975 22.5151 75.5126 41.0371 75.5126C59.5592 75.5126 74.5748 60.4977 74.5752 41.9755V40.7421C74.5752 38.8091 76.1422 37.2421 78.0752 37.2421C80.0081 37.2422 81.5752 38.8092 81.5752 40.7421V41.9755C81.5747 63.1844 65.2864 80.5857 44.5371 82.3603V99.9999C44.5371 101.933 42.9701 103.5 41.0371 103.5C39.1041 103.5 37.5371 101.933 37.5371 99.9999Z"
                                                fill="white" />
                                        </svg>
                                    </span>

                                    <span class="icon-mic none" id="voice-media-on">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="71" viewBox="0 0 52 71"
                                            fill="none">
                                            <path d="M5.53286 5.5L5.53125 65.5" stroke="white" stroke-width="10"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M46.2477 5.5L46.2461 65.5" stroke="white" stroke-width="10"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </span>
                                </div>
                                <span id="recordingTimer" class="record-time md_font_size  none">00:00</span>
                                
                            </div>
                            <div id="audio_upload_block">

                            </div>
                            
                        </div>
                        <!-- Add preview block HERE -->
                        <div id="preview-audio" class="blockscroll preview-container">
                            <div class="record-again none">
                                <span class="btn-text md_font_size">
                                    Record again
                                </span>
                                <span class="icon-mic">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="82" height="104" viewBox="0 0 82 104"
                                        fill="none">
                                        <rect x="22.3145" y="3.5" width="37.4444" height="59.6765" rx="18.7222"
                                            stroke="white" stroke-width="7" stroke-linecap="round" />
                                        <path
                                            d="M37.5371 99.9999V82.3603C16.7879 80.5857 0.5 63.1843 0.5 41.9755V40.7421C0.5 38.8091 2.067 37.2421 4 37.2421C5.933 37.2421 7.5 38.8091 7.5 40.7421V41.9755C7.5 60.4975 22.5151 75.5126 41.0371 75.5126C59.5592 75.5126 74.5748 60.4977 74.5752 41.9755V40.7421C74.5752 38.8091 76.1422 37.2421 78.0752 37.2421C80.0081 37.2422 81.5752 38.8092 81.5752 40.7421V41.9755C81.5747 63.1844 65.2864 80.5857 44.5371 82.3603V99.9999C44.5371 101.933 42.9701 103.5 41.0371 103.5C39.1041 103.5 37.5371 101.933 37.5371 99.9999Z"
                                            fill="white" />
                                    </svg>
                                </span>
                                <audio id="recorded-audio" src=""></audio>
                            </div>
                            <!--<img class="micButton none" src="svg/recorded-voice.svg" alt="recorded voice media">-->
                        </div>
                        <div  class="blockscroll preview-container"></div>
                    </div>
                </div>
                <span class="response_msg error" id="audioError"></span>
            </div>
            <div id="preview-video" class="upload">
               
                    <div class="blockscroll drop-preview-area  preview-container preview-container-video">
                        <div id="drop-area-videocover" class="drop-area none">
                            <div class="upload-content">
                                <div class="plus-icon"><i class="fi fi-sr-plus"></i></div>
                                <span class="upload-label">Upload video cover</span>
                            </div>
                            <input type="file" id="file-input-videocover" accept=".png, .jpg, .jpeg, .gif, .webp" hidden />
                        </div>
                        <div id="drop-area-videolong" class="drop-area">
                            <div class="upload-content">
                                <div class="plus-icon"><i class="fi fi-sr-plus"></i></div>
                                <span class="upload-label">Add short video</span>
                            </div>
                            <input type="file" id="file-input-videolong" accept=".mp4, .avi, .mov, .webm" hidden />
                        </div>

                        <div id="drop-area-videoshort" class="drop-area none">
                            <div class="upload-content">
                                <div class="plus-icon"><i class="fi fi-sr-plus"></i></div>
                                <span class="upload-label">Add long video</span>
                            </div>
                            <input type="file" id="file-input-videoshort" accept=".mp4, .avi, .mov, .webm" hidden />
                        </div>

                    </div>
                    <span class="response_msg error" id="videoError"></span>
                

            </div>
            <div id="videoTrimContainer" class="none timeline-wrapper">
                <div class="video-trim-wrapper">
                    <video id="videoTrim"></video>
                    <div id="videoTimeline">


                    </div>
                    <div id="overlay-left" class="trim-overlay"></div>
                    <div id="overlay-right" class="trim-overlay"></div>
                    <!-- Trim window -->
                    <div id="trim-window" class="trim-window">
                        <div id="handle-left" class="trim-handle"></div>
                        <div style="flex:1"></div>
                        <div id="handle-right" class="trim-handle"></div>
                    </div>
                </div>
                <div id="trimButtons">
                    <span class="button" id="trimQuit">back</span>
                    <span class="button btn-blue" id="trimBtn">save</span>
                </div>
            </div>
            <div id="crop-container" class="none">
                <canvas id="cropcanvas" width="1500" height="1500"></canvas>
                <canvas id="croppedCanvas" width="500" height="500"></canvas>
                <div id="cropButtons">
                    <span class="button" id="cropQuit">back</span>
                    <span class="button btn-blue" id="cropBtn">save</span>
                </div>
                <div id="aspectRatioSelect" class="aspect-ratio-toggle">
                    <input type="radio" id="ar-1" name="aspectRatio" value="1" checked>
                    <label for="ar-1">1:1 Square</label>
                    <input type="radio" id="ar-2" name="aspectRatio" value="0.8">
                    <label for="ar-2">4:5 Vertical</label>
                </div>
            </div>
            <div class="form-row">
                <div class="col-left">
                    <label for="titleNotes" class="md_font_size">Title*</label>
                </div>
                <div class="col-right input-wrapper">
                    <input type="text" id="titleNotes" placeholder="Title" name="text-input"  />
                     <span id="title_limit_box" class="char-counter md_font_size" data-target="titleNotes"><span class="char_count">0</span>/<span class="char_limit">63</span></span>
                    <span class="response_msg error" id="titleError"></span>
                </div>
            </div>
            <div class="form-row">
                <div class="col-left">
                    <label for="descriptionNotes" class="md_font_size">Description</label>
                </div>
                <div class="col-right input-wrapper">
                    <div class="textarea-wrapper">
                        <textarea id="descriptionNotes" rows="8" placeholder="What’s new?" name="text-input"
                            maxlength=""></textarea>
                        <span id="desc_limit_box" class="char-counter md_font_size" data-target="descriptionNotes"><span class="char_count">0</span>/<span class="char_limit">20000</span></span>
                    </div>
                    <span class="response_msg error" id="descriptionError"></span>
                </div>
            </div>
            <div class="form-row">
                <div class="col-left">
                    <label for="tag-input" class="md_font_size">Tags</label>
                </div>
                <div class="col-right">
                    <div class="tag-wrapper">
                        <!-- Selected Tags -->
                        <div class="tag-section selected-tags" id="selected-tags-section">
                            <div id="tagsSelected" class="tag-list selected-container"></div>
                        </div>

                        <!-- Tag Input -->
                        <div class="input-icon-wrapper">
                            <input id="tag-input" type="text" placeholder="Click here to add #hastags" />
                            <!-- Optional: include search icon inside field -->
                            <!-- Example only if you plan to absolutely position it -->
                            <img src="svg/search.svg" alt="Search" class="search-icon">
                        </div>
                        <!-- Recently Used Section -->
                        <div class="tag-section" id="tag-history-section">
                            <div class="section-header">
                                <label>Recently Used</label>
                                <span id="clearTagHistory" class="clear-history">Clear History</span>
                            </div>
                            <div id="tagHistoryContainer" class="tag-list"></div>
                        </div>
                        <!-- Suggestions from Search -->
                        <div class="tag-section" id="tag-suggestions-section">
                            <div class="section-header">
                                <label>Suggestions</label>
                            </div>
                            <div id="tagsContainer" class="tag-list"></div>
                        </div>
                    </div>
                    <span class="response_msg error" id="tagError"></span>
                </div>
            </div>
            <div class="response_msg" id="createPostError"></div>
            <div class="form-actions">
                <div class="left-actions">
                    <button id="previewButton" type="button" class="btn-gray bold">Preview</button>
                    <button class="btn-red-transparent" type="reset">Clear Fields</button>
                </div>
                <div class="right-actions">
                    <span class="form-note">You will spend 1 free post</span>
                    <button type="submit" class="btn-blue bold" id="submitPost">Post</button>
                </div>
            </div>
        </form>
    </div>
</div>