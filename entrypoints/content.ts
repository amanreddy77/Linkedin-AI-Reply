import editIcon from "~/assets/editing.svg";
import insertIcon from "~/assets/inserting.svg";
import generateIcon from "~/assets/generate.svg";
import regenerateIcon from "~/assets/regenerate.svg";

// This script is designed to run on LinkedIn pages, creating a custom modal for generating and inserting messages.
export default defineContentScript({
  matches: ["*://*.linkedin.com/*"], // Target LinkedIn URLs only
  main() {
    // HTML template for the custom modal, hidden by default, used to enter prompts and display generated messages
    const modalHtml = `
      <div id="custom-modal" style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: none; justify-content: center; align-items: center; z-index: 4000;">
        <div id="modal-content" style="background: white; border-radius: 8px; width: 100%; max-width: 570px; padding: 20px;">
          <div id="messages" style="margin-top: 10px; max-height: 200px; overflow-y: auto; padding: 10px; display: flex; flex-direction: column;"></div>
          <div style="margin-bottom: 10px;">
            <input id="input-text" type="text" placeholder="Enter your prompt..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"/>
          </div>
          <div style="text-align: right; margin-top: 12px;">
            <button id="insert-btn" style="background: #fff; color: #666D80; padding: 8px 16px; border: 2px solid #666D80; border-radius: 4px; cursor: pointer; display: none; margin-right: 10px;">
              <img src="${insertIcon}" alt="Insert" style="vertical-align: middle; margin-right: 5px; width: 14px; height: 14px;"> 
              <b>Insert</b>
            </button>
            <button id="generate-btn" style="background: #007bff; color: white; padding: 8px 16px; border: 2px solid #007bff; border-radius: 4px; cursor: pointer;">
              <img src="${generateIcon}" alt="Generate" style="vertical-align: middle; margin-right: 5px; width: 14px"> 
              <b>Generate</b>
            </button>
          </div>
        </div>
      </div>
    `;

    // Add the modal HTML to the document body
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    // Cache references to modal and key elements for easy access
    const modal = document.getElementById("custom-modal") as HTMLDivElement;
    const modalContent = document.getElementById("modal-content") as HTMLDivElement;
    const generateBtn = document.getElementById("generate-btn") as HTMLButtonElement;
    const insertBtn = document.getElementById("insert-btn") as HTMLButtonElement;
    const inputText = document.getElementById("input-text") as HTMLInputElement;
    const messagesDiv = document.getElementById("messages") as HTMLDivElement;

    let lastGeneratedMessage = ""; // To store the last generated message
    let parentElement: HTMLElement | null = null; // Holds the reference to the selected LinkedIn message input box

    // Detect clicks on LinkedIn message input areas to add a custom icon and set up the modal
    document.addEventListener("click", (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        target.matches(".msg-form__contenteditable") ||
        target.closest(".msg-form__contenteditable")
      ) {
        // Locate the closest container and add active/focused styles if not already present
        parentElement =
          target.closest(".msg-form__container") ||
          target.closest(".msg-form__contenteditable");

        const contentContainer = parentElement?.closest(
          ".msg-form_msg-content-container"
        );

        if (parentElement && contentContainer) {
          contentContainer.classList.add(
            "msg-form_msg-content-container--is-active"
          );
          parentElement.setAttribute("data-artdeco-is-focused", "true");
        }

        // Append custom edit icon if not already present
        if (parentElement && !parentElement.querySelector(".edit-icon")) {
          parentElement.style.position = "relative";

          const icon = document.createElement("img");
          icon.className = "edit-icon";
          icon.src = editIcon;
          icon.alt = "Custom Icon";
          icon.style.position = "absolute";
          icon.style.bottom = "5px";
          icon.style.right = "5px";
          icon.style.width = "30px";
          icon.style.height = "30px";
          icon.style.cursor = "pointer";
          icon.style.zIndex = "1000";
          parentElement.appendChild(icon);

          icon.addEventListener("click", (e) => {
            e.stopPropagation();
            modal.style.display = "flex"; // Display the modal on icon click
          });
        }
      }
    });

    // Simulate message generation
    const generateMessage = () => {
      return "Thank you for the opportunity! If you have any questions, feel free to ask.";
    };

    // Handle click event for the "Generate" button
    generateBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      const inputValue = inputText.value.trim();
      if (!inputValue) return;

      // Display the user's input prompt
      const userMessageDiv = document.createElement("div");
      userMessageDiv.textContent = inputValue;
      Object.assign(userMessageDiv.style, {
        backgroundColor: "#DFE1E7",
        color: "#666D80",
        borderRadius: "12px",
        padding: "10px",
        marginBottom: "5px",
        textAlign: "right",
        maxWidth: "80%",
        alignSelf: "flex-end",
        marginLeft: "auto",
      });
      messagesDiv.appendChild(userMessageDiv);

      generateBtn.disabled = true;
      generateBtn.textContent = "Loading...";
      generateBtn.style.backgroundColor = "#666D80";

      setTimeout(() => {
        // Generate and display a new message, styled to appear as generated output
        lastGeneratedMessage = generateMessage();
        const generatedMessageDiv = document.createElement("div");
        generatedMessageDiv.textContent = lastGeneratedMessage;
        Object.assign(generatedMessageDiv.style, {
          backgroundColor: "#DBEAFE",
          color: "#666D80",
          borderRadius: "12px",
          padding: "10px",
          marginBottom: "5px",
          textAlign: "left",
          maxWidth: "80%",
          alignSelf: "flex-start",
          marginRight: "auto",
        });

        messagesDiv.appendChild(generatedMessageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Reset button appearance and enable the "Insert" button
        generateBtn.disabled = false;
        generateBtn.style.backgroundColor = "#007bff";
        generateBtn.style.color = "white";
        generateBtn.innerHTML = `<img src="${regenerateIcon}" alt="Regenerate" style="vertical-align: middle; margin-right: 5px; width: 16px; height: 16px"> <b>Regenerate</b>`;

        inputText.value = "";
        insertBtn.style.display = "inline-block";
      }, 500);
    });

    // Handle the "Insert" button click to place the generated message into the LinkedIn message box
    insertBtn.addEventListener("click", () => {
      if (lastGeneratedMessage && parentElement) {
        parentElement.removeAttribute("aria-label");

        let existingParagraph = parentElement.querySelector("p");

        if (!existingParagraph) {
          existingParagraph = document.createElement("p");
          parentElement.appendChild(existingParagraph);
        }

        existingParagraph.textContent = lastGeneratedMessage;
        insertBtn.style.display = "none";
        modal.style.display = "none";
      }
    });

    // Close the modal if the user clicks outside of it
    document.addEventListener("click", (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        modal.style.display === "flex" &&
        !modalContent.contains(target) &&
        !target.classList.contains("edit-icon")
      ) {
        modal.style.display = "none";
      }
    });
  },
});
