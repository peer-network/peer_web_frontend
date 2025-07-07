<div class="create_post">
    <div class="inner-container">


        <form id="newNotesPost" class="upload active resettable-form" method="post">
            <div class="form-row">
                <div class="col-left">
                    <label for="titleNotes">Title*</label>
                </div>
                <div class="col-right">
                    <input type="text" id="titleNotes" placeholder="Add title" name="text-input" maxlength="150"
                        required />
                    <span class="error-message" id="titleError"></span>
                </div>
            </div>

            <div class="form-row">
                <div class="col-left">
                    <label for="descriptionNotes">Description</label>
                </div>
                <div class="col-right">
                    <textarea id="descriptionNotes" rows="8" placeholder="What's on your mind?" name="text-input"
                        maxlength="1200" required></textarea>
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
                        <input id="tag-input" type="text" placeholder="Search or create tags" />

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

                        <!-- Error for Tags -->
                       
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


        <form id="newImagePost" class="upload resettable-form" method="post">
            <h2>Upload File</h2>
            <div id="drop-area-image" class="drop-area image-media">
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
            </div>
            <p>The maximum file size is 4MB</p>
            <div class="form-row">
                <div class="col-left">
                    <label for="titleNotes">Title*</label>
                </div>
                <div class="col-right">
                    <input type="text" id="titleNotes" placeholder="Add title" name="text-input" maxlength="150"
                        required />
                </div>
            </div>

            <div class="form-row">
                <div class="col-left">
                    <label for="descriptionNotes">Description</label>
                </div>
                <div class="col-right">
                    <textarea id="descriptionNotes" rows="8" placeholder="What's on your mind?" name="text-input"
                        maxlength="1200" required></textarea>
                </div>
            </div>

            <p class="form-note">Maximum Text size is 4MB</p>

            <div class="form-row">
                <div class="col-left">
                    <label for="tag-input">Tags</label>
                </div>
                <div class="col-right">
                    <input type="text" id="tag-input" placeholder="#..." />
                </div>
            </div>

            <div class="form-actions">
                <div class="left-actions">
                    <button type="button">Preview</button>
                    <button type="reset">Clear Fields</button>
                </div>
                <div class="right-actions">
                    <span class="form-note">You will spend 1 free post</span>
                    <button class="btn-blue" id="createPostImage">Upload</button>
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

                        <img class="filterButton" src="img/voice-icon.png" alt="Audio upload" />
                        <div>
                            <p>Supported formats:</p>
                            <p>.mp3, .wav, .flac, .aac</p>
                        </div>

                        <input type="file" id="file-input-audio" accept=".mp3, .wav, .flac, .aac" hidden />
                    </div>
                </div>
                <div class="col-right">
                    <div id="drop-area-audio" class="voice-media">
                        <img class="filterButton" src="img/voice-icon.png" alt="Audio upload" />
                        <input type="file" id="file-input-audio" accept=".mp3, .wav, .flac, .aac" hidden />
                    </div>
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
                    <label for="titleNotes">Title</label>
                </div>
                <div class="col-right">
                    <input type="text" id="titleAudio" placeholder="Add title" name="text-input" maxlength="150"
                        required />
                </div>
            </div>
            <div class="form-row">
                <div class="col-left">
                    <label for="descriptionNotes">Description</label>
                </div>
                <div class="col-right">
                    <textarea id="descriptionAudio" rows="4" placeholder="Write a caption" name="text-input"
                        maxlength="200" required></textarea>
                </div>
            </div>

            <p>The maximum file size is 4MB</p>

            <div class="form-row">
                <div class="col-left">
                    <label for="tag-input">Tags</label>
                </div>
                <div class="col-right">
                    <input type="text" id="tag-input" placeholder="#..." />
                </div>
            </div>

            <div class="form-actions">
                <div class="left-actions">
                    <button type="button">Preview</button>
                    <button type="reset">Clear Fields</button>
                </div>
                <div class="right-actions">
                    <span class="form-note">You will spend 1 free post</span>
                    <button type="submit" class="btn-blue" id="">Post</button>
                </div>
            </div>
        </form>
        <form id="newVideoPost" class="upload resettable-form" method="post">
            <h2>Upload File</h2>
            <div id="drop-area-video" class="drop-area">
                <div>
                    <p>Drag and Drop file here</p>
                    <p>
                        or
                        <u>Choose File</u>
                    </p>
                </div>
                <img class="filterButton" src="svg/filterVideo.svg" alt="Video upload" />
                <div>
                    <p>Supported formats:</p>
                    <p>.mp4, .avi, .mov, .webm</p>
                </div>

                <input type="file" id="file-input-video" accept=".mp4, .avi, .mov, .webm" hidden />
            </div>
            <p>The maximum file size is 4MB</p>

            <!-- <label for="bildueberschrift">Überschrift:</label> -->
            <input type="text" id="titleVideo" placeholder="Add title" name="text-input" maxlength="150" required />
            <!-- <label for="bildbeschreibung">Beschreibung:</label> -->
            <textarea id="descriptionVideo" rows="4" placeholder="Write a caption" name="text-input" maxlength="200"
                required></textarea>
            <div id="preview-video" class="blockscroll preview-container"></div>
            <button class="btn-blue" id="createPostVideo">Upload</button>
        </form>
    </div>
</div>