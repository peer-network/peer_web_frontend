<div class="create_post">
    <div class="inner-container">
        <form id="create_new_post" class=" resettable-form" method="post" data-post-type="text">
            <div id="preview-image" class="upload">
                <div class="drop-preview-area preview-container">
                    <div  class="image-preview-container">
                        <span class="button nav-button prev-button none"><i class="peer-icon peer-icon-arrow-left"></i></span>
                        <div class="preview-track-wrapper">
                            <div class="preview-track">
                                <!-- JS will insert .preview-item divs here -->
                            </div>
                        </div>

                        <span class="button nav-button next-button none"><i class="peer-icon peer-icon-arrow-right"></i></span>
                    </div>
                    <div id="drop-area-image" class="drop-area">
                        <div class="plus-icon"><i class="peer-icon peer-icon-plus"></i></div>
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
                        <div class="plus-icon"><i class="peer-icon peer-icon-plus"></i></div>
                        <span class="upload-label">Upload more images</span>
                    </div>
                </div>
                <span class="response_msg error" id="imageError"></span>

            </div>
            <div id="preview-audio" class="upload">
                <div class="form-row">
                    <div class="col-left">
                        <div id="drop-area-audio" class="drop-area">
                            <div class="plus-icon"><i class="peer-icon peer-icon-plus"></i></div>
                          <span class="upload-label">Upload .mp3, .wav, .flac, .aac, m4a</span>
                            <input type="file" id="file-input-audio" accept=".mp3, .wav, .flac, .aac, .m4a" hidden />
                        </div>
                    </div>
                    <div class="col-right">
                        <div id="voice-record-wrapper" class="voice-media">
                            <div class="audiobackground_uploader none">
                                <div id="drop-area-audiobackground"  class="drop-area drop-area-audiobackground">
                                    <div class="upload-content">
                                        <div class="plus-icon"><i class="peer-icon peer-icon-plus"></i></div>
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
                                        <i class="peer-icon peer-icon-mic"></i>
                                        
                                    </span>

                                    <span class="icon-mic" id="voice-media-steady">
                                        <i class="peer-icon peer-icon-mic"></i>
                                        
                                    </span>

                                    <span class="icon-mic none" id="voice-media-on">
                                        <i class="peer-icon peer-icon-pause"></i>
                                        
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
                                    <i class="peer-icon peer-icon-mic"></i>
                                   
                                </span>
                                <audio id="recorded-audio"></audio>
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
                                <div class="plus-icon"><i class="peer-icon peer-icon-plus"></i></div>
                                <span class="upload-label">Upload video cover</span>
                            </div>
                            <input type="file" id="file-input-videocover" accept=".png, .jpg, .jpeg, .gif, .webp" hidden />
                        </div>
                        <div id="drop-area-videolong" class="drop-area">
                            <div class="upload-content">
                                <div class="plus-icon"><i class="peer-icon peer-icon-plus"></i></div>
                                <span class="upload-label">Add short video</span>
                            </div>
                            <input type="file" id="file-input-videolong" accept=".mp4, .avi, .ogg, .mkv, .3gp, .m4v" hidden />
                        </div>

                        <div id="drop-area-videoshort" class="drop-area none">
                            <div class="upload-content">
                                <div class="plus-icon"><i class="peer-icon peer-icon-plus"></i></div>
                                <span class="upload-label">Add long video</span>
                            </div>
                            <input type="file" id="file-input-videoshort" accept=".mp4, .avi, .ogg, .mkv, .3gp, .m4v" hidden />
                        </div>

                    </div>
                    <span class="response_msg error" id="videoError"></span>
                

            </div>
            <div id="videoTrimContainer" class="none timeline-wrapper">

                
                    <div class="video-trim-wrapper">
                        <video id="videoTrim"></video>
                        
                        <div class="croping-panel">
                            <div id="videoTimeline">
                            
                            </div>
                            <div id="longVideoTimeline"></div>
                            <div id="shortVideoTimeline"></div>
                            <span id="videoPos"></span>
                            <div id="overlay-left" class="trim-overlay"></div>
                            <div id="overlay-right" class="trim-overlay"></div>
                            <!-- Trim window -->
                            <div id="trim-window" class="trim-window">
                                <div id="handle-left" class="trim-handle"></div>
                                <div style="flex:1"></div>
                                <div id="handle-right" class="trim-handle"></div>
                                
                            </div>
                        </div>
                    </div>
                    <div id="trimButtons">
                        <span class="button btn-transparent" id="trimQuit">Back</span>
                        <span class="time-indication start-piont"><label class="txt-color-gray">Start time</label><span id="video_start"></span></span>
                        <span class="time-indication end-piont"><label class="txt-color-gray">End time</label><span id="video_end"></span></span>
                        <span class="time-indication duration"><label class="txt-color-gray">Duration</label><span id="video_druration"></span></span>
                        <span class="time-indication videosize"><label class="txt-color-gray">Size</label><span id="video_MB"></span></span>
                        <span class="button btn-blue" id="trimBtn">Save</span>
                    </div>
               

            </div>
            <div id="crop-container" class="none">
                <div class="crop-container-inner">
                    <canvas id="cropcanvas" width="1500" height="1500"></canvas>
                    <canvas id="croppedCanvas" width="500" height="500"></canvas>
                    <div id="cropButtons">
                        <span class="button btn-transparent" id="cropQuit">Back</span>
                        <span class="button btn-blue" id="cropBtn">Save</span>
                    </div>
                    <div id="aspectRatioSelect" class="aspect-ratio-toggle">
                        <input type="radio" id="ar-1" name="aspectRatio" value="1" checked>
                        <label for="ar-1">1:1 Square</label>
                        <input type="radio" id="ar-2" name="aspectRatio" value="0.8">
                        <label for="ar-2">4:5 Vertical</label>
                    </div>
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
                        <textarea class="text_descriptionNotes" id="descriptionNotes" rows="8" placeholder="What’s new?" name="text-input"
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