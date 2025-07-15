<div class="create_post">
    <div class="inner-container">
        <form id="create_new_post" class=" resettable-form" method="post" data-post-type="text">
            <div id="newImagePost" class="upload">
            
                <div  class="drop-preview-area preview-container">
                    <div id="preview-image" class="image-preview-container">
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
                        <input type="file" id="file-input-image" hidden multiple />
                    </div>
                </div>
                <span class="response_msg error" id="imageError"></span>
               
            </div>
            <div id="newAudioPost" class="upload">         
                <div class="form-row">
                    <div class="col-left">
                        <div id="drop-area-audio" class="drop-area">
                            <div class="plus-icon"><i class="fi fi-sr-plus"></i></div>
                            <span class="upload-label">Upload .mp3, .wav, .flac, .aac</span>

                            <input type="file" id="file-input-audio" accept=".mp3, .wav, .flac, .aac" hidden />
                        </div>
                    </div>
                    <div class="col-right">
                        <div id="voice-record-wrapper" class="voice-media">
                            <img class="micButton" src="img/voice-icon.png" alt="Audio upload" />
                            <input type="file" id="file-input-music" accept=".mp3, .wav, .flac, .aac" hidden />
                        </div>
                        <!-- Add preview block HERE -->
                        <div id="preview-audio" class="blockscroll preview-container"></div>
                    </div>
                </div>
                <span class="response_msg error" id="audioError"></span>
            </div>
            <div  id="newVideoPost" class="upload">
               
                <div id="preview-video" class="blockscroll drop-preview-area  preview-container preview-container-video">
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
            
             <div id="crop-container" class="none">
                    <canvas id="cropcanvas" width="2000" height="2000"></canvas>
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
                <div class="col-right">
                    <input type="text" id="titleNotes" placeholder="min. 25 symbols" name="text-input" maxlength="150" />
                    <span class="response_msg error" id="titleError"></span>
                </div>
            </div>

            <div class="form-row">
                <div class="col-left">
                    <label for="descriptionNotes" class="md_font_size">Description</label>
                </div>
                <div class="col-right">
                    <div class="textarea-wrapper">
                        <textarea id="descriptionNotes" rows="8" placeholder="What’s new?" name="text-input"
                            maxlength="" ></textarea>
                        <span class="char-counter md_font_size" data-target="descriptionNotes">0/250</span>
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
                    <button type="button" class="btn-gray bold">Preview</button>
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