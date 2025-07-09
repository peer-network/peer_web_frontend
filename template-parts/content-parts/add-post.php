<div class="create_post">
    <div class="inner-container">
        <form id="newNotesPost" class="upload active resettable-form" method="post">
            <div class="form-row">
                <div class="col-left">
                    <label for="titleNotes" class="md_font_size">Title*</label>
                </div>
                <div class="col-right">
                    <input type="text" id="titleNotes" placeholder="min. 25 symbols" name="text-input" maxlength="150"
                        required />
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
                            maxlength="1200" required></textarea>
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

            <div class="form-actions">
                <div class="left-actions">
                    <button type="button" class="btn-gray bold">Preview</button>
                    <button class="btn-red-transparent" type="reset">Clear Fields</button>
                </div>
                <div class="right-actions">
                    <span class="form-note">You will spend 1 free post</span>
                    <button type="submit" class="btn-blue bold" id="createPostNotes">Post</button>
                </div>
            </div>
        </form>
        <form id="newImagePost" class="upload resettable-form" method="post">
            <h2>Upload File</h2>
            <div id="preview-image" class="drop-preview-area preview-container">
                <!-- <div id="" class="blockscroll"></div> -->
                <!--<div id="drop-area-image" class="drop-area">
                    <div>
                        <p>Drag and Drop file here</p>
                        <p>
                            or
                            <u>Choose File</u>
                        </p>
                    </div>

                    <img class="filterButton" src="svg/filterImage.svg" alt="Image upload" />
                    <div>
                        <p>Supported formats:</p>
                        <p>.png, .jpg, .jpeg, .gif, .webp</p>
                    </div>

                    <input type="file" id="file-input-image" accept=".png, .jpg, .jpeg, .gif, .webp" hidden multiple />
                    <p>The maximum file size is 4MB</p>
                </div>-->
                <div id="drop-area-image" class="drop-area">
                    <div class="plus-icon">+</div>
                    <span>Upload media</span>
                    <input type="file" id="file-input-image" hidden multiple />
                </div>

            </div>
            <div class="form-row">
                <div class="col-left">
                    <label for="titleNotes">Title*</label>
                </div>
                <div class="col-right">
                    <input type="text" id="titleImage" placeholder="min. 25 symbols" name="text-input" maxlength="50"
                        required />
                </div>
            </div>

            <div class="form-row">
                <div class="col-left">
                    <label for="descriptionNotes">Description</label>
                </div>
                <div class="col-right">
                    <textarea id="descriptionImage" rows="8" placeholder="What’s new?" name="text-input" maxlength="500"
                        required></textarea>
                </div>
            </div>

            <p class="form-note">Maximum Text size is 4MB</p>

            <div class="form-row">
                <div class="col-left">
                    <label for="tag-input">Tags</label>
                </div>
                <div class="col-right">
                    <div class="tag-wrapper">
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
                                <button id="clearTagHistory" class="clear-history">Clear History</button>
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

                        <!-- Selected Tags -->
                        <div class="tag-section" id="selected-tags-section">
                            <div class="section-header">
                                <label>Selected Tags</label>
                            </div>
                            <div id="tagsSelected" class="tag-list selected-container"></div>
                        </div>
                    </div>
                    <span class="error-message" id="tagError"></span>
                </div>
            </div>

            <div class="form-actions">
                <div class="left-actions">
                    <button type="button">Preview</button>
                    <button type="reset">Clear Fields</button>
                </div>
                <div class="right-actions">
                    <span class="form-note">You will spend 1 free post</span>
                    <button type="submit" class="btn-blue" id="createPostNotes">Post</button>
                </div>
            </div>
            <div id="crop-container" class="none">
                <canvas id="cropcanvas" width="2000" height="2000"></canvas>
                <canvas id="croppedCanvas" width="500" height="500"></canvas>
                <div id="cropButtons">
                    <button id="cropQuit">back</button>
                    <button id="cropBtn">save</button>
                </div>
                <div id="aspectRatioSelect" class="aspect-ratio-toggle">
                    <input type="radio" id="ar-1" name="aspectRatio" value="1" checked>
                    <label for="ar-1">1:1 Square</label>
                    <input type="radio" id="ar-2" name="aspectRatio" value="0.8">
                    <label for="ar-2">4:5 Vertical</label>
                </div>
            </div>
        </form>
        <form id="newAudioPost" class="upload resettable-form" method="post">
            <h2>Upload music</h2>
            <div class="form-row">
                <div class="col-left">
                    <div id="drop-area-audio" class="drop-area">
                        <div>
                            <p>Drag and Drop file here</p>
                            <p>
                                or
                                <u>Choose File</u>
                            </p>
                        </div>

                        <img class="fileTriggerButton" src="img/voice-icon.png" alt="Audio upload" />
                        <div>
                            <p>Supported formats:</p>
                            <p>.mp3, .wav, .flac, .aac</p>
                        </div>

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
            <!--    
            <h2>Upload cover</h2>
            <div id="drop-area-cover" class="drop-area">
                <div>
                    <p>Drag and Drop file here</p>
                    <p>
                        or
                        <u>Choose File</u>
                    </p>
                </div>

                <img class="filterButton" src="svg/filterImage.svg" alt="Cover upload" />
                <div>
                    <p>Supported formats:</p>
                    <p>.png, .jpg, .jpeg, .gif, .webp</p>
                </div>

                <input type="file" id="file-input-cover" accept=".png, .jpg, .jpeg, .gif, .webp" hidden />
            </div>
            <p>The maximum file size is 4MB</p>
            <div id="preview-cover" class="blockscroll preview-container"></div>
            <div id="preview-audio" class="blockscroll preview-container"></div>
            <button class="btn-blue" id="createPostAudio">Upload</button>-->

            <div class="form-row">
                <div class="col-left">
                    <label for="titleNotes">Title*</label>
                </div>
                <div class="col-right">
                    <input type="text" id="titleNotes" placeholder="min. 25 symbols" name="text-input" maxlength="150"
                        required />
                    <span class="error-message" id="titleError"></span>
                </div>
            </div>

            <div class="form-row">
                <div class="col-left">
                    <label for="descriptionNotes">Description</label>
                </div>
                <div class="col-right">
                    <div class="textarea-wrapper">
                        <textarea id="descriptionNotes" rows="8" placeholder="What’s new?" name="text-input"
                            maxlength="1200" required></textarea>
                        <span class="char-counter" data-target="descriptionNotes">0/250</span>
                    </div>

                    <span class="error-message" id="descriptionError"></span>
                </div>
            </div>

            <p class="form-note">Maximum Text size is 4MB</p>

            <div class="form-row">
                <div class="col-left">
                    <label for="tag-input">Tags</label>
                </div>
                <div class="col-right">
                    <div class="tag-wrapper">
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
                                <button id="clearTagHistory" class="clear-history">Clear History</button>
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

                        <!-- Selected Tags -->
                        <div class="tag-section" id="selected-tags-section">
                            <div class="section-header">
                                <label>Selected Tags</label>
                            </div>
                            <div id="tagsSelected" class="tag-list selected-container"></div>
                        </div>
                    </div>
                    <span class="error-message" id="tagError"></span>
                </div>
            </div>

            <div class="form-actions">
                <div class="left-actions">
                    <button type="button">Preview</button>
                    <button type="reset">Clear Fields</button>
                </div>
                <div class="right-actions">
                    <span class="form-note">You will spend 1 free post</span>
                    <button type="submit" class="btn-blue" id="createPostNotes">Post</button>
                </div>
            </div>
        </form>
        <form id="newVideoPost" class="upload resettable-form" method="post">
            <h2>Upload File</h2>
            <div id="drop-area-video" class="drop-preview-area preview-container">
                <div id="drop-area-video-inner" class="drop-area">
                    <div class="upload-content">
                        <div class="plus-icon">+</div>
                        <span class="upload-label">Upload media</span>
                    </div>
                    <input type="file" id="file-input-video" accept=".mp4, .avi, .mov, .webm" hidden />
                </div>
            </div>
            <div class="form-row">
                <div class="col-left">
                    <label for="titleNotes">Title*</label>
                </div>
                <div class="col-right">
                    <input type="text" id="titleVideo" placeholder="min. 25 symbols" name="text-input" maxlength="150"
                        required />
                    <span class="error-message" id="titleError"></span>
                </div>
            </div>

            <div class="form-row">
                <div class="col-left">
                    <label for="descriptionVideo">Description</label>
                </div>
                <div class="col-right">
                    <div class="textarea-wrapper">
                        <textarea id="descriptionVideo" rows="8" placeholder="What’s new?" name="text-input"
                            maxlength="1200" required></textarea>
                        <span class="char-counter" data-target="descriptionVideo">0/250</span>
                        <div id="preview-video" class="blockscroll preview-container"></div>
                    </div>

                    <span class="error-message" id="descriptionError"></span>
                </div>
            </div>

            <p class="form-note">Maximum Text size is 4MB</p>

            <div class="form-row">
                <div class="col-left">
                    <label for="tag-input">Tags</label>
                </div>
                <div class="col-right">
                    <div class="tag-wrapper">
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
                                <button id="clearTagHistory" class="clear-history">Clear History</button>
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

                        <!-- Selected Tags -->
                        <div class="tag-section" id="selected-tags-section">
                            <div class="section-header">
                                <label>Selected Tags</label>
                            </div>
                            <div id="tagsSelected" class="tag-list selected-container"></div>
                        </div>
                    </div>
                    <span class="error-message" id="tagError"></span>
                </div>
            </div>

            <div class="form-actions">
                <div class="left-actions">
                    <button type="button">Preview</button>
                    <button type="reset">Clear Fields</button>
                </div>
                <div class="right-actions">
                    <span class="form-note">You will spend 1 free post</span>
                    <button type="submit" class="btn-blue" id="createPostNotes">Post</button>
                </div>
            </div>
        </form>
    </div>
</div>