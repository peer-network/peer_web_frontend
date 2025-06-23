<div class="create_post">
    <div class="inner-container">
        <form id="newImagePost" class="upload" method="post">
            <h2>Upload File</h2>
            <div id="drop-area-image" class="drop-area">
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

            <!-- <label for="bildueberschrift">Überschrift:</label> -->
            <input type="text" id="titleImage" placeholder="Add title" name="text-input" maxlength="150" required />
            <!-- <label for="bildbeschreibung">Beschreibung:</label> -->
            <textarea id="descriptionImage" rows="4" placeholder="Write a caption" name="text-input" maxlength="200"
                required></textarea>
            <div id="preview-image" class="blockscroll preview-container"></div>
            <button class="btn-blue" id="createPostImage">Upload</button>
        </form>
        <form id="newNotesPost" class="upload" method="post">
            <input type="text" id="titleNotes" placeholder="Add title" name="text-input" maxlength="150" required />
            <textarea id="descriptionNotes" rows="8" placeholder="What's on your mind?" name="text-input"
                maxlength="1200" required></textarea>
            <p>The maximum Text size is 4MB</p>
            <button class="btn-blue" id="createPostNotes">Upload</button>
        </form>
        <form id="newAudioPost" class="upload" method="post">
            <h2>Upload music</h2>
            <div id="drop-area-audio" class="drop-area">
                <div>
                    <p>Drag and Drop file here</p>
                    <p>
                        or
                        <u>Choose File</u>
                    </p>
                </div>

                <img class="filterButton" src="svg/filterMusic.svg" alt="Audio upload" />
                <div>
                    <p>Supported formats:</p>
                    <p>.mp3, .wav, .flac, .aac</p>
                </div>

                <input type="file" id="file-input-audio" accept=".mp3, .wav, .flac, .aac" hidden />
            </div>
            <p>The maximum file size is 4MB</p>

            <!-- <label for="bildueberschrift">Überschrift:</label> -->
            <input type="text" id="titleAudio" placeholder="Add title" name="text-input" maxlength="150" required />
            <!-- <label for="bildbeschreibung">Beschreibung:</label> -->
            <textarea id="descriptionAudio" rows="4" placeholder="Write a caption" name="text-input" maxlength="200"
                required></textarea>
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
            <button class="btn-blue" id="createPostAudio">Upload</button>
        </form>
        <form id="newVideoPost" class="upload" method="post">
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