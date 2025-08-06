<div class="widget">
    	<div class="widget-head">
            <img src="svg/sort-icon.svg" alt="">
            <h3 class="widget-title">Sort by</h3>
        </div>
            <form  class="filterContainer">
                <!-- Sort Filter -->
                <section class="filter-section">
                    <button type="button" class="filter-toggle filter-section-header" aria-expanded="false" aria-controls="sort-options">
                        <div class="filter-section-container">
                            <img src="svg/most-icon.svg" alt="" class="most-icon section-icon">
                            <span class="section-title">Most...</span>
                        </div>
                        <img src="svg/content-arrow.svg" alt="" class="section-arrow">
                    </button>
                    <div class="filter-options content-options" id="sort-options">
                        <div class="filterGroup">
                            <input id="filterMostLiked" sortby="LIKES" class="chkMost" type="radio" name="sortby" />
                            <label for="filterMostLiked" class="filterButton most" title="Sort by most liked">
                                <img src="svg/post-like.svg" alt="MostLiked filter"/>
                                <span>Likes</span>
                            </label>
                            <input id="filterMostControversial" sortby="DISLIKES" class="chkMost" type="radio" name="sortby" />
                            <label for="filterMostControversial" class="filterButton most" title="Sort by most controversial">
                                <img src="svg/most-dislikes.svg" alt="MostControversial filter"/>
                                <span>Dislikes</span>
                            </label>
                            <input id="filterMostViewed" data-icon="svg/most-views.svg" sortby="VIEWS" class="chkMost" type="radio" name="sortby" />
                            <label for="filterMostViewed" class="filterButton most" title="Sort by most viewed">
                                <img src="svg/most-views.svg" alt="MostViewed filter"/>
                                <span>Viewed</span>
                            </label>
                            <input id="filterMostPopular" data-icon="svg/controversial.svg" sortby="VIEWS" class="chkMost" type="radio" name="sortby" />
                            <label for="filterMostPopular" class="filterButton most" title="Sort by most popular"/>
                                <img src="svg/controversial.svg" alt="MostPopular filter">
                                <span>Trends</span>
                            </label>
                            <input id="filterMostCommented" sortby="COMMENTS" class="chkMost" type="radio" name="sortby"/>
                            <label for="filterMostCommented" class="filterButton most" title="Sort by most commented">
                                <img src="svg/post-comment.svg" alt="MostCommented filter"/>
                                <span>Thread</span>
                            </label>
                        </div>
                    </div>
                </section>
            </form>
    </div>