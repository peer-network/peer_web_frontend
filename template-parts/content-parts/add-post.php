<div id="addPost" class="none scrollable">
    <div class="inner-container">
        <input id="createImage" type="radio" name="postArt" value="image/*" checked />
        <input id="createNotes" type="radio" name="postArt" value=".txt" />
        <input id="createAudio" type="radio" name="postArt" value="audio/*" />
        <input id="createVideo" type="radio" name="postArt" value="video/*" />
        <input id="createPodcast" type="radio" name="postArt" disabled />
        <input id="createShorts" type="radio" name="postArt" disabled />
        <input id="createPolls" class="filterButton" type="radio" name="postArt" disabled />
        <input id="createQuiz" type="radio" name="postArt" disabled />
        <input id="createEvent" type="radio" name="postArt" disabled />
        <menu class="filter select">
            <div class="center">
                <h2>Create a new Post</h2>
                <p>Choose a category to get started:</p>
            </div>
            <div class="filterGroup">
                <label id="labelCreateImage" for="createImage" class="filterButton" title="Fotos"><img src="svg/filterImage.svg" alt="Image create" /></label>
                <label id="labelCreateNotes" for="createNotes" class="filterButton" title="Notes" name="notes"><img src="svg/filterNotes.svg" alt="Notes create" /></label>
                <label id="labelCreateAudio" for="createAudio" class="filterButton" title="Audio"><img src="svg/filterMusic.svg" alt="Audio create" /></label>
            </div>
            <div class="filterGroup">
                <label id="labelCreateVideo" for="createVideo" class="filterButton" title="Video"><img src="svg/filterVideo.svg" alt="Video create" /></label>
                <label id="labelCreatePodcast" for="createPodcast" class="filterButton" title="playlist"><img src="svg/filterPodcast.svg" alt="Podcast create" /></label>
                <label id="labelCreateShorts" for="createShorts" class="filterButton" title="local"><img src="svg/filterFickFuck.svg" alt="Shorty create" /></label>
            </div>
            <div class="filterGroup">
                <label id="labelCreatePolls" for="createPolls" class="filterButton" title="Polls"><img src="svg/filterPolls.svg" alt="Polls create" /></label>
                <label id="labelCreateQuiz" for="createQuiz" class="filterButton" title="Quiz"><img src="svg/filterQuiz.svg" alt="Quiz create" /></label>
                <label id="labelCreateEvent" for="createEvent" class="filterButton" title="Event"><img src="svg/filterEvent.svg" alt="Event create" /></label>
            </div>
        </menu>
        <form id="newImagePost" class="upload" method="post">
            <h2>Upload File</h2>
            <div id="preview-image" class="drop-preview-area preview-container">
                <!-- <div id="" class="blockscroll"></div> -->
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
                    <p>The maximum file size is 4MB</p>
                </div>
            </div>
            <!-- <label for="bildueberschrift">Überschrift:</label> -->
            <input type="text" id="titleImage" placeholder="Add title" name="text-input" maxlength="150" required />
            <!-- <label for="bildbeschreibung">Beschreibung:</label> -->
            <textarea id="descriptionImage" rows="4" placeholder="Write a caption" name="text-input" maxlength="200" required></textarea>


            <button class="btn-blue" id="createPostImage">Upload</button>
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
        <form id="newNotesPost" class="upload" method="post">
            <input type="text" id="titleNotes" placeholder="Add title" name="text-input" maxlength="150" required />
            <textarea id="descriptionNotes" rows="8" placeholder="What's on your mind?" name="text-input" maxlength="1200" required></textarea>
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
            <textarea id="descriptionAudio" rows="4" placeholder="Write a caption" name="text-input" maxlength="200" required></textarea>
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
            <textarea id="descriptionVideo" rows="4" placeholder="Write a caption" name="text-input" maxlength="200" required></textarea>
            <div id="preview-video" class="blockscroll preview-container"></div>
            <button class="btn-blue" id="createPostVideo">Upload</button>
        </form>
        <div class="addTags">
            <h4># Add tags</h4>
            <p>include up to 10 tags</p>
            <input id="tag-input" type="text" placeholder="Search or create tags" />
            <div class="dropdown-content" id="dropdownMenu">
            </div>
            <div id="tagsContainer">

            </div>
            <!-- <button id="tagCreate">+ Create tag</button> -->
        </div>
        <div id="closeAddPost" class="btClose"><img src="svg/plus2.svg" alt="close" /></div>
    </div>
</div>