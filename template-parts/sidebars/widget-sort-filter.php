<div class="widget">
    	<h3 class="widget-title">Sorting</h3>
    	<div class="widget-inner widget-type-box">
        <form  class="filterContainer">
        	<div class="filterGroup">
                <input id="filterMostLiked" sortby="LIKES" class="chkMost" type="radio" name="sortby" />
                <label for="filterMostLiked" class="filterButton most" title="Sort by most liked">
                    <img src="svg/post-like.svg" alt="MostLiked filter"/>
                    <span>Likes</span>
                </label>
                <input id="filterMostCommented" sortby="COMMENTS" class="chkMost" type="radio" name="sortby"/>
                <label for="filterMostCommented" class="filterButton most" title="Sort by most commented">
                    <img src="svg/post-comment.svg" alt="MostCommented filter"/>
                    <span>Comments</span>
                </label>
                <input id="filterMostPopular" sortby="VIEWS" class="chkMost" type="radio" name="sortby" />
                <label for="filterMostPopular" class="filterButton most" title="Sort by most popular"/>
                    <img src="svg/popular.svg" alt="MostPopular filter">
                    <span>Popular</span>
                </label>
                <input id="filterMostControversial" sortby="DISLIKES" class="chkMost" type="radio" name="sortby" />
                <label for="filterMostControversial" class="filterButton most" title="Sort by most controversial">
                    <img src="svg/controversial.svg" alt="MostControversial filter"/>
                    <span>Discussing</span>
                </label>
            </div>
        </form>
    	</div>
    </div>