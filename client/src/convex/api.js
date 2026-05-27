const functionName = Symbol.for("functionName")

function createApi(pathParts = []) {
  const handler = {
    get(_, prop) {
      if (typeof prop === "string") {
        const newParts = [...pathParts, prop]
        return createApi(newParts)
      } else if (prop === functionName) {
        if (pathParts.length < 2) {
          const found = ["api", ...pathParts].join(".")
          throw new Error(
            `API path is expected to be of the form \`api.moduleName.functionName\`. Found: \`${found}\``
          )
        }
        const path = pathParts.slice(0, -1).join("/")
        const exportName = pathParts[pathParts.length - 1]
        return exportName === "default" ? path : `${path}:${exportName}`
      } else if (prop === Symbol.toStringTag) {
        return "FunctionReference"
      } else {
        return undefined
      }
    },
  }
  return new Proxy({}, handler)
}

export const api = createApi()
export const hasConvexUrl = Boolean(import.meta.env.VITE_CONVEX_URL)

