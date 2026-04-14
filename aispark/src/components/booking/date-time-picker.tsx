"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface DateTimePickerProps {
  onSelect: (date: Date, time: string) => void
  bookedDates?: Date[]
}

const TIME_SLOTS = Array.from({ length: 37 }, (_, i) => {
  const totalMinutes = i * 15
  const hour = Math.floor(totalMinutes / 60) + 9
  const minute = totalMinutes % 60
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
})

export function DateTimePicker({ onSelect, bookedDates = [] }: DateTimePickerProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const handleContinue = () => {
    if (date && selectedTime) {
      onSelect(date, selectedTime)
    }
  }

  return (
    <Card className="gap-0 p-0">
      <CardContent className="p-0">
        {/* Calendar — full width, no competition for space */}
        <div className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={[...bookedDates, { before: new Date() }]}
            showOutsideDays={false}
            className="w-full bg-transparent p-0"
          />
        </div>

        {/* Time slots — 3-column grid below calendar, never overlapping */}
        <div className="border-t p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Available times</p>
          <div className="no-scrollbar max-h-40 overflow-y-auto">
            <div className="grid grid-cols-3 gap-1.5">
              {TIME_SLOTS.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => setSelectedTime(time)}
                  size="sm"
                  className="w-full text-xs shadow-none"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t px-6 py-5 md:flex-row">
        <div className="text-sm">
          {date && selectedTime ? (
            <>
              Your booking is scheduled for{" "}
              <span className="font-medium">
                {date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}
              </span>{" "}
              at <span className="font-medium">{selectedTime}</span>.
            </>
          ) : (
            <>Select a date and time for your booking.</>
          )}
        </div>
        <Button
          disabled={!date || !selectedTime}
          className="w-full md:ml-auto md:w-auto"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  )
}

