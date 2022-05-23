import { __TEST_MODE__ } from 'util/constants'

export const useVersion = () => {
  let version: string
  let splittedVersion: string[]

  version = process.env.NEXT_PUBLIC_APP_VERSION
  if (version) {
    if (__TEST_MODE__) {
      if (process.env.NEXT_PUBLIC_APP_COMMIT)
        version += ' ' + process.env.NEXT_PUBLIC_APP_COMMIT?.substring(0, 7)
    } else {
      splittedVersion = version.split(':')
      if (splittedVersion && splittedVersion.length > 1)
        version = splittedVersion[1]
    }
  }

  return { version }
}
