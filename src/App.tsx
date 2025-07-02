import { useState, useEffect } from "react"
import "./App.css"
import { Plus, Settings, RotateCcw, Sun, Moon, Crown } from "lucide-react"

interface Friend {
  id: string
  name: string
  avatar: string
  timezone: string
  city: string
  country: string
}

const timezones = [
  { value: "America/New_York", label: "New York (EST)", city: "New York", country: "USA" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)", city: "Los Angeles", country: "USA" },
  { value: "Europe/London", label: "London (GMT)", city: "London", country: "UK" },
  { value: "Europe/Paris", label: "Paris (CET)", city: "Paris", country: "France" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", city: "Tokyo", country: "Japan" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)", city: "Shanghai", country: "China" },
  { value: "Asia/Seoul", label: "Seoul (KST)", city: "Seoul", country: "South Korea" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)", city: "Sydney", country: "Australia" },
  { value: "Asia/Dubai", label: "Dubai (GST)", city: "Dubai", country: "UAE" },
  { value: "Europe/Berlin", label: "Berlin (CET)", city: "Berlin", country: "Germany" },
]

export default function App() {
  const [friends, setFriends] = useState<Friend[]>([
  {
    id: "1",
    name: "Jinchuan Li",
    avatar: "https://picsum.photos/32/32?random=1",
    timezone: "America/Los_Angeles", // 美西时区
    city: "Los Angeles",
    country: "USA",
  },
  {
    id: "2",
    name: "Vicky Chen",
    avatar: "https://picsum.photos/32/32?random=2",
    timezone: "America/New_York", // 美东时区
    city: "New York",
    country: "USA",
  },
  {
    id: "3",
    name: "Tony",
    avatar: "https://picsum.photos/32/32?random=3",
    timezone: "Asia/Ho_Chi_Minh", // 越南时区
    city: "Ho Chi Minh City",
    country: "Vietnam",
  },
  {
    id: "4",
    name: "Emma Wilson Emma Wilson Emma Wilson",
    avatar: "https://picsum.photos/32/32?random=4",
    timezone: "Asia/Tokyo", // 日本时区
    city: "Tokyo",
    country: "Japan",
  },
  {
    id: "5",
    name: "Monica Chen",
    avatar: "https://picsum.photos/32/32?random=5",
    timezone: "America/Toronto", // 加拿大时区
    city: "Toronto",
    country: "Canada",
  },
]
)

  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeOffset, setTimeOffset] = useState(0) // 时间偏移，单位：分钟
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newFriend, setNewFriend] = useState({
    name: "",
    timezone: "",
    avatar: "",
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // 获取调整后的时间
  const getAdjustedTime = () => {
    const adjustedTime = new Date(currentTime.getTime() + timeOffset * 60 * 1000)
    return adjustedTime
  }

  const formatTime = (timezone: string) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(getAdjustedTime())
  }

  const formatDate = (timezone: string) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(getAdjustedTime())
  }

  const getTimeStatus = (timezone: string) => {
    const hour = Number.parseInt(
      new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        hour12: false,
      }).format(getAdjustedTime()),
    )

    // 简化为白天和夜晚
    if (hour >= 6 && hour < 18) {
      return {
        icon: Sun,
        color: "#E57C00",
      }
    } else {
      return {
        icon: Moon,
        color: "#993DC8",
      }
    }
  }

  const getCurrentTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  const addFriend = () => {
    if (newFriend.name && newFriend.timezone) {
      const selectedTimezone = timezones.find((tz) => tz.value === newFriend.timezone)
      if (selectedTimezone) {
        const friend: Friend = {
          id: Date.now().toString(),
          name: newFriend.name,
          avatar: newFriend.avatar || `https://picsum.photos/32/32?random=${Date.now()}`,
          timezone: newFriend.timezone,
          city: selectedTimezone.city,
          country: selectedTimezone.country,
        }
        setFriends([...friends, friend])
        setNewFriend({ name: "", timezone: "", avatar: "" })
        setIsAddDialogOpen(false)
      }
    }
  }

  const handleTimeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeOffset(Number(e.target.value))
  }

  const resetTimeOffset = () => {
    setTimeOffset(0)
  }

  const formatTimeOffset = (offset: number) => {
    if (offset === 0) return "Now"
    const hours = Math.floor(Math.abs(offset) / 60)
    const minutes = Math.abs(offset) % 60
    const sign = offset > 0 ? "+" : "-"
    if (hours === 0) {
      return `${sign}${minutes}m`
    }
    return minutes === 0 ? `${sign}${hours}h` : `${sign}${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="pl-4 pr-3 py-4 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-lg font-bold">
            <span className="text-gray-900">MyFriend</span>
            <span className="font-mono ml-0.5 text-[#E57C00]">
              Time
            </span>
          </h1>
          <div className="flex items-center">
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-end"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-end">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* My Time - Owner Section */}
        <div className="px-4 py-4 bg-gray-50 border-b border-gray-200 relative">
          {/*<div className="absolute top-3 right-5">*/}
          {/*  <Crown className="h-2.5 w-2.5 text-[#E57C00]" />*/}
          {/*</div>*/}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative">
                <div className="h-10 w-10 ring-2 ring-[#E57C00] shadow-md rounded-full overflow-hidden bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm">
                  <img
                    src="https://images.godruoyi.com/gblog/assets/brand_logo.Z0NyS6D-_2cLiuT.webp"
                    alt="Me"
                    className="w-full h-full object-cover"
                  />
                  <span style={{ display: "none" }}>Me</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">Lianbo</p>
                  {/*<span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">*/}
                  {/*  Owner*/}
                  {/*</span>*/}
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  {
                    new Intl.DateTimeFormat("en-US", {
                      timeZone: getCurrentTimezone(),
                      timeZoneName: "short",
                    })
                      .formatToParts(getAdjustedTime())
                      .find((part) => part.type === "timeZoneName")?.value
                  }
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              <p className="text-lg font-mono font-bold text-gray-900">{formatTime(getCurrentTimezone())}</p>
              <p className="text-xs text-gray-600 font-medium">{formatDate(getCurrentTimezone())}</p>
            </div>
          </div>
        </div>

        {/* Friends List */}
        <div className="max-h-96 overflow-y-auto">
          {friends.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <div className="text-2xl mb-2">🌍</div>
              <p className="text-sm">No friends added yet</p>
              <p className="text-xs text-gray-400 mt-1">Click + to add your first friend</p>
            </div>
          ) : (
            friends.map((friend) => {
              const timeStatus = getTimeStatus(friend.timezone)
              const IconComponent = timeStatus.icon
              return (
                <div
                  key={friend.id}
                  className="px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    {/* 头像 */}
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 ring-2 ring-gray-200 shadow-sm rounded-full overflow-hidden bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                            e.currentTarget.nextElementSibling!.style.display = "flex"
                          }}
                        />
                        <span style={{ display: "none" }}>
                          {friend.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    </div>

                    {/* 用户信息 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{friend.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {friend.city}, {friend.country}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      <IconComponent className="h-4 w-4" color={timeStatus.color} />
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-mono font-semibold text-gray-900">{formatTime(friend.timezone)}</p>
                      <p className="text-xs text-gray-500">{formatDate(friend.timezone)}</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Time Slider */}
        <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">Time Travel</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono text-gray-700">{formatTimeOffset(timeOffset)}</span>
                  {timeOffset !== 0 && (
                    <button
                      onClick={resetTimeOffset}
                      className="h-5 w-5 p-0 hover:bg-gray-200 rounded transition-colors flex items-center justify-center"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <input
                type="range"
                min={-720}
                max={720}
                step={10}
                value={timeOffset}
                onChange={handleTimeSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>-12h</span>
                <span>Now</span>
                <span>+12h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Friend Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add Friend</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
                <input
                  type="text"
                  placeholder="Friend's name"
                  value={newFriend.name}
                  onChange={(e) => setNewFriend({ ...newFriend, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                <select
                  value={newFriend.timezone}
                  onChange={(e) => setNewFriend({ ...newFriend, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select timezone</option>
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Avatar URL (optional)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newFriend.avatar}
                  onChange={(e) => setNewFriend({ ...newFriend, avatar: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addFriend}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Add Friend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
