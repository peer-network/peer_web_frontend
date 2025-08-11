<div class="widget">
    <div class="widget-head">
        <img src="svg/filter-icon.svg" alt="">
        <h3 class="widget-title">Filters</h3>
    </div>
    <form class="filterContainer">

        <!-- Content Filter -->
        <section class="filter-section">
            <button type="button" class="filter-toggle filter-section-header" aria-expanded="false" aria-controls="content-options">
                <div class="filter-section-container">
                    <img src="svg/content-icon.svg" alt="" class="section-icon">
                    <span class="section-title">Content</span>
                </div>
                <img src="svg/content-arrow.svg" alt="" class="section-arrow">
            </button>
                <div class="filter-options content-options" id="content-options">
                    <div class="filterGroup">
                        <input checked id="filterImage" type="checkbox" name="IMAGE" class="filteritem" />
                        <label for="filterImage" class="filterButton" title="Fotos">
                            <img src="svg/photo.svg" alt="Image filter"/>
                            <span>Photo</span>
                        </label>
                        <input checked id="filterVideo" type="checkbox" name="VIDEO" class="filteritem" />
                        <label for="filterVideo" class="filterButton" title="Video">
                            <img src="svg/videos.svg" alt="Video filter"/>
                            <span>Video</span>
                        </label>
                        <input checked id="filterNotes" type="checkbox" name="TEXT" class="filteritem" />
                        <label for="filterNotes" class="filterButton" title="Notes" name="notes">
                            <img src="svg/text.svg" alt="Notes filter"/>
                            <span>Text</span>
                        </label>
                        <input checked id="filterAdio" type="checkbox" name="AUDIO" class="filteritem" />
                        <label for="filterAdio" class="filterButton" title="Audio">
                            <img src="svg/music.svg" alt="Audio filter"/>
                            <span>Music</span>
                        </label>
                    </div>
                </div>
        </section>
    </form>
    <form class="filterContainer">
        
        <!-- Feed Filter -->
        <section class="filter-section">
            <button type="button" class="feed filter-toggle filter-section-header" aria-expanded="false" aria-controls="feed-options">
                <div class="filter-section-container">
                    
                    <img src="svg/feed-icon.svg" alt="" class="section-icon">
                    <span class="section-title">Feed</span>
                    <span class="section-selected-label">All</span>
                </div>
            </button>
            <div class="filter-options feed-options" id="feed-options">
                <div class="filterGroup-feed">
                    <label class="filter-btn">
                        <input type="radio" name="feed" value="all" checked>
                        <span>All</span>
                    </label>
                    <label class="filter-btn">
                        <input type="radio" name="feed" value="followers">
                        <span>Followers</span>
                    </label>
                    <label class="filter-btn">
                        <input type="radio" name="feed" value="following">
                        <span>Following</span>
                    </label>
                    <label class="filter-btn">
                        <input type="radio" name="feed" value="peers">
                        <span class="peers">peers</span>
                    </label>
                </div>
            </div>
        </section>
    </form>
    <form class="filterContainer">

        <!-- Time Filter -->
        <section class="filter-section">
            <button type="button" class="time filter-toggle filter-section-header" aria-expanded="false" aria-controls="time-options">
                <div class="filter-section-container">
                    <img src="svg/time-icon.svg" alt="" class="section-icon">
                    <span class="section-title">Time</span>
                    <span class="section-selected-label">All</span>
                </div>
            </button>
            <div class="filter-options time-options" id="time-options">
                <div class="filterGroup-feed">
                    <label class="filter-btn">
                        <input type="radio" name="time" value="all" checked>
                        <span>All</span>
                    </label>
                    <label class="filter-btn">
                        <input type="radio" name="time" value="today">
                        <span>Today</span>
                    </label>
                    <label class="filter-btn">
                        <input type="radio" name="time" value="week">
                        <span>This week</span>
                    </label>
                    <label class="filter-btn">
                        <input type="radio" name="time" value="month">
                        <span>This month</span>
                    </label>
                    <label class="filter-btn">
                        <input type="radio" name="time" value="custom">
                        <span>Custom</span>
                    </label>
                </div>
            </div>
        </section>
    </form>
</div>

