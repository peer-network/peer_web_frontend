window.moderationModule = window.moderationModule || {};

moderationModule.schema = {

  STATS: `
    query ModerationStats {
      moderationStats {
          status
          ResponseCode
          affectedRows {
              AmountAwaitingReview
              AmountHidden
              AmountRestored
              AmountIllegal
          }
          meta {
              status
              RequestId
              ResponseCode
              ResponseMessage
          }
      }
  }`,

  LIST_ITEMS: `
    query ModerationItems {
    moderationItems(offset: 0, limit: 20) {
        status
        ResponseCode
        affectedRows {
            moderationTicketId
            targetContentId
            targettype
            reportscount
            status
            createdat
            targetcontent {
                user {
                    userid
                    img
                    username
                    slug
                    biography
                    visibilityStatus
                    hasActiveReports
                    updatedat
                }
                comment {
                    commentid
                    userid
                    postid
                    parentid
                    content
                    createdat
                    visibilityStatus
                    hasActiveReports
                    amountlikes
                    amountreplies
                    amountreports
                    isreported
                    isliked
                    user {
                        id
                        username
                        slug
                        img
                        visibilityStatus
                        hasActiveReports
                        isfollowed
                        isfollowing
                        isreported
                        isfriend
                    }
                }
                post {
                    id
                    contenttype
                    title
                    media
                    cover
                    mediadescription
                    createdat
                    visibilityStatus
                    hasActiveReports
                    amountreports
                    amountlikes
                    amountviews
                    amountcomments
                    amountdislikes
                    amounttrending
                    isliked
                    isviewed
                    isreported
                    isdisliked
                    issaved
                    tags
                    url
                    user {
                        id
                        username
                        slug
                        img
                        visibilityStatus
                        hasActiveReports
                        isfollowed
                        isfollowing
                        isreported
                        isfriend
                    }
                }
            }
            reporters {
                userid
                img
                username
                slug
                biography
                visibilityStatus
                hasActiveReports
                updatedat
            }
      }
    }
  }`,

  LIST_POST: `
      query ModerationItems($offset: Int, $limit: Int, $contentType: ModerationContentType) {
       moderationItems(offset: $offset, limit: $limit, contentType: $contentType) {
        status
        ResponseCode
        affectedRows {
          moderationTicketId
          targetContentId
          targettype
          reportscount
          status
          createdat
          targetcontent {
            post {
              id
              contenttype
              title
              media
              cover
              mediadescription
              createdat
              visibilityStatus
              hasActiveReports
              amountreports
              amountlikes
              amountviews
              amountcomments
              amountdislikes
              amounttrending
              isliked
              isviewed
              isreported
              isdisliked
              issaved
              tags
              url
              user {
                id
                username
                slug
                img
                visibilityStatus
                hasActiveReports
                isfollowed
                isfollowing
                isreported
                isfriend
              }
            }
          }
        }
      }
    }
  `,

  LIST_COMMENT: `
      query ModerationItems($offset: Int, $limit: Int, $contentType: ModerationContentType) {
      moderationItems(offset: $offset, limit: $limit, contentType: $contentType) {
        status
        ResponseCode
        affectedRows {
            moderationTicketId
            targetContentId
            targettype
            reportscount
            status
            createdat
            targetcontent {
                comment {
                    commentid
                    userid
                    postid
                    parentid
                    content
                    createdat
                    visibilityStatus
                    hasActiveReports
                    amountlikes
                    amountreplies
                    amountreports
                    isreported
                    isliked
                }
            }
            reporters {
                userid
                img
                username
                slug
                biography
                visibilityStatus
                hasActiveReports
                updatedat
            }
        }
    }
  }`,

  LIST_USER: `
    query ModerationItems($offset: Int, $limit: Int, $contentType: ModerationContentType) {
      moderationItems(offset: $offset, limit: $limit, contentType: $contentType) {
        status
        ResponseCode
        affectedRows {
          moderationTicketId
          targetContentId
          targettype
          reportscount
          status
          createdat
          targetcontent {
            user {
              userid
              img
              username
              slug
              biography
              visibilityStatus
              hasActiveReports
              updatedat
            }
          }
        }
      }
    }
  `,

  LIST_POST_BY_ID: `query ($postid: ID!) {
      listPosts(postid: $postid) {
        status
        counter
        ResponseCode
        affectedRows {
          id
          contenttype
          title
          media
          cover
          mediadescription
          createdat
          visibilityStatus
          isHiddenForUsers
          hasActiveReports
          amountreports
          amountlikes
          amountviews
          amountcomments
          amountdislikes
          amounttrending
          isliked
          isviewed
          isreported
          isdisliked
          issaved
          tags
          url
          user {
            id
            username
            slug
            img
            visibilityStatus
            isHiddenForUsers
            hasActiveReports
            isfollowed
            isfollowing
            isreported
            isfriend
          }
        }
      }
  }`,

  LIST_USER_BY_ID: `query ($userid: ID!) {
    getProfile(userid: $userid) {
        status
        ResponseCode
        affectedRows {
            id
            username
            status
            slug
            img
            biography
            visibilityStatus
            amounttrending
            amountfollowed
            amountfollower
            amountfriends
            amountblocked
            amountreports
            amountposts
            isreported
            isfollowing
            isfollowed
            isHiddenForUsers
            hasActiveReports
        }
    }
  }`,
};
