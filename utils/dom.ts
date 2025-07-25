export function waitForElement(selector: string) {
    return new Promise((resolve, reject) => {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector)

            if (el) {
                observer.disconnect()
                resolve(void 0)
            }
        })

        observer.observe(document.body, {
            childList: true,
        })

        setTimeout(() => {
            observer.disconnect()
            reject(new Error(`Element "${selector}" was not found within 10 seconds`))
        }, 1000 * 10);
    })
}
