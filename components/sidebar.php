<?php
/**
 * Author: Luqman
 * Dated: 29 April 2025
 * Usage: This template provides the sidebar navigation for the site.
 * It contains links to different sections of the dashboard, such as chat, profile and settings.
 * The sidebar is included in various pages (e.g., dashboard, chat pages) to provide a consistent navigation experience across the site.
 * The file ensures that the sidebar layout and links are centralized, making future updates easier and maintaining uniformity.
 */
?>

<aside class="sidebar">
   <form id="filter" class="filterContainer">
                    <a href="dashboard.php" class="dash">
                        <img class="logo" src="svg/Home.svg" alt="Peer Network Logo" />
                        <h1 id="h1">Dashboard</h1>
                    </a>
                <div class="filter-sec">
                    <div class="center">
                        &nbsp;Filter
                    </div>
                    <menu class="filter">
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
                            <!-- <input checked id="filterPodcast" type="checkbox" name="PODCAST" />
                            <label for="filterPodcast" class="filterButton" title="playlist"><img src="svg/filterPodcast.svg" alt="Podcast filter" /></label>
                            <input checked id="filterFickFuck" type="checkbox" name="LOCAL" />
                            <label for="filterFickFuck" class="filterButton" title="local"><img src="svg/filterFickFuck.svg" alt="Local filter" /></label> -->
                        </div>
                        <!-- <div class="filterGroup">
                            <input checked id="filterPolls" class="filterButton" type="checkbox" name="POLLS" />
                            <label for="filterPolls" class="filterButton" title="Polls"><img src="svg/filterPolls.svg" alt="Polls filter" /></label>
                            <input checked id="filterQuiz" type="checkbox" name="QUIZ" />
                            <label for="filterQuiz" class="filterButton" title="Quiz"><img src="svg/filterQuiz.svg" alt="Quiz filter" /></label>
                            <input checked id="filterEvent" type="checkbox" name="EVENT" />
                            <label for="filterEvent" class="filterButton" title="Event"><img src="svg/filterEvent.svg" alt="Event filter" /></label>
                        </div> -->
                    </menu>
                </div>
                <div class="sort-sec">
                    <div class="center">
                        &nbsp;Sort by top values
                    </div>
                    <div class="menu">
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
                    </div>
                </div>
                <div class="con-freeaction">
                    <h2>Daily free actions</h2>
                    <div class="limit-container">
                        <div class="label">
                            Likes
                            <span>(</span>
                            <span id="Likesused">&nbsp;</span>
                            <span>/</span>
                            <span id="Likesavailable">&nbsp;</span>
                            <span>&nbsp;left)</span>
                        </div>
                        <div class="progress-bar">
                            <div id="LikesStat" class="progress" ></div>
                        </div>
                    </div>

                    <div class="limit-container">
                        <div class="label">
                            Comments
                            <span>(</span>
                            <span id="Commentsused">&nbsp;</span>
                            <span>/</span>
                            <span id="Commentsavailable">&nbsp;</span>
                            <span>&nbsp;left)</span>
                        </div>
                        <div class="progress-bar">
                            <div id="CommentsStat" class="progress" ></div>
                        </div>
                    </div>

                    <div class="limit-container">
                        <div class="label">
                            Posts
                            <span>(</span>
                            <span id="Postsused">&nbsp;</span>
                            <span>/</span>
                            <span id="Postsavailable">&nbsp;</span>
                            <span>&nbsp;left)</span>
                        </div>
                        <div class="progress-bar">
                            <div id="PostsStat" class="progress" ></div>
                        </div>
                    </div>
                </div>
            </form>
</aside>