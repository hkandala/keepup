import { Divider, Spinner } from "@geist-ui/core";
import { ExternalLink, Trash2 } from "@geist-ui/icons";

import { Saved } from "../lib/types/saved.interface";
import { getSavedItemHash } from "../pages";

export default function SavedList(props) {
  const [savedItems, savingItems, addSavedItem, deleteSavedItem] =
    props.savedItemsHook;

  const savedItemsList: Saved[] = Object.values(savedItems);
  savedItemsList.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="saved-wrapper">
      {savedItemsList.map((item) => (
        <div key={getSavedItemHash(item)}>
          <div className="saved-list-item">
            <div className="saved-link-content">
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.title}
              </a>
              {item.alternativeUrl ? (
                <a
                  href={item.alternativeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="discussion-link"
                >
                  <ExternalLink size={13} />
                </a>
              ) : (
                <></>
              )}
            </div>
            <div>
              {savingItems[getSavedItemHash(item)] ? (
                <Spinner className="delete-saved-loader" scale={0.5} />
              ) : (
                <Trash2
                  size={14}
                  className="delete-saved-item"
                  onClick={() => {
                    deleteSavedItem(item);
                  }}
                />
              )}
            </div>
          </div>
          <Divider my={1.5} />
        </div>
      ))}
    </div>
  );
}
