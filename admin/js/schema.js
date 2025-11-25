window.moderationModule = window.moderationModule || {};

moderationModule.schema = {
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
    query ModerationItems {
      moderationItems(offset: 0, limit: 20, contentType: post) {
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
    query ModerationItems {
    moderationItems(limit: 20, offset: 0, contentType: comment) {
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

  LIST_USER: `
    query ModerationItems {
      moderationItems(offset: 0, limit: 20, contentType: user) {
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
};
