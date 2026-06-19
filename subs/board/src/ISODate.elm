module ISODate exposing (formatDate, now)

import Task
import Time


formatDate : Time.Zone -> Time.Posix -> String
formatDate zone posix =
    let
        year =
            Time.toYear zone posix

        month =
            Time.toMonth zone posix

        day =
            Time.toDay zone posix

        pad n =
            String.padLeft 2 '0' (String.fromInt n)

        monthNum m =
            case m of
                Time.Jan ->
                    1

                Time.Feb ->
                    2

                Time.Mar ->
                    3

                Time.Apr ->
                    4

                Time.May ->
                    5

                Time.Jun ->
                    6

                Time.Jul ->
                    7

                Time.Aug ->
                    8

                Time.Sep ->
                    9

                Time.Oct ->
                    10

                Time.Nov ->
                    11

                Time.Dec ->
                    12
    in
    [ year, monthNum month, day ]
        |> List.map pad
        |> String.join "-"


now : Task.Task x String
now =
    Task.map2 formatDate Time.here Time.now
