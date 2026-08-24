export function showLoading(status, message) {
  status.hidden = false; status.className = "status-panel";
  status.replaceChildren(Object.assign(document.createElement("span"),{className:"loader"}),Object.assign(document.createElement("p"),{textContent:message}));
  status.firstElementChild.setAttribute("aria-hidden","true");
}

export function showError(status, title, message, retry) {
  status.hidden = false; status.className = "status-panel error";
  const heading = Object.assign(document.createElement("h2"),{textContent:title});
  const copy = Object.assign(document.createElement("p"),{textContent:message});
  const button = Object.assign(document.createElement("button"),{textContent:"Try again",className:"button primary",type:"button"});
  button.addEventListener("click",retry,{once:true}); status.replaceChildren(heading,copy,button);
}

export function setUpdateSummary(countElement, updateElement, count, generated) {
  countElement.textContent = `${count.toLocaleString()} event${count === 1 ? "" : "s"}`;
  updateElement.textContent = `Feed updated ${new Intl.DateTimeFormat(undefined,{hour:"numeric",minute:"2-digit"}).format(new Date(generated))}`;
}
