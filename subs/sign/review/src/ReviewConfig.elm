module ReviewConfig exposing (config)

import NoDeprecated
import NoDuplicatePorts
import NoInconsistentAliases
import NoMissingSubscriptionsCall
import NoMissingTypeAnnotation
import NoMissingTypeExpose
import NoPrematureLetComputation
import NoRecursiveUpdate
import NoUnsafePorts
import NoUnused.CustomTypeConstructorArgs
import NoUnused.CustomTypeConstructors
import NoUnused.Dependencies
import NoUnused.Exports
import NoUnused.Modules
import NoUnused.Parameters
import NoUnused.Patterns
import NoUnused.Variables
import NoUnusedPorts
import NoUselessSubscriptions
import Review.Rule exposing (Rule)
import Simplify
import UseCamelCase


{-| <https://github.com/jfmengels/elm-review-unused>
-}
configUnused : List Rule
configUnused =
    [ NoUnused.CustomTypeConstructorArgs.rule
    , NoUnused.CustomTypeConstructors.rule []
    , NoUnused.Dependencies.rule
    , NoUnused.Exports.rule
    , NoUnused.Modules.rule
    , NoUnused.Parameters.rule
    , NoUnused.Patterns.rule
    , NoUnused.Variables.rule
    ]


{-| <https://github.com/jfmengels/elm-review-simplify>
-}
configSimplify : List Rule
configSimplify =
    [ Simplify.rule Simplify.defaults
    ]


{-| <https://github.com/jfmengels/elm-review-common>
-}
configCommon : List Rule
configCommon =
    [ NoDeprecated.rule NoDeprecated.defaults
    , NoMissingTypeAnnotation.rule
    , NoMissingTypeExpose.rule
    , NoPrematureLetComputation.rule
    ]


{-| <https://github.com/sparksp/elm-review-ports>
-}
configPorts : List Rule
configPorts =
    [ NoDuplicatePorts.rule
    , NoUnsafePorts.rule NoUnsafePorts.onlyIncomingPorts
    , NoUnusedPorts.rule
    ]


{-| <https://github.com/sparksp/elm-review-camelcase>
-}
configCamelCase : List Rule
configCamelCase =
    [ UseCamelCase.rule UseCamelCase.default
    ]


{-| <https://github.com/sparksp/elm-review-imports>

    rejected: NoModuleOnExposedNames.rule
    - wants to remove Html from Html.map, if Html is exposing(...)

-}
configImports : List Rule
configImports =
    [ NoInconsistentAliases.config
        [ ( "Json.Decode", "Decode" )
        , ( "Json.Encode", "Encode" )
        ]
        |> NoInconsistentAliases.noMissingAliases
        |> NoInconsistentAliases.rule
    ]


{-| <https://github.com/jfmengels/elm-review-the-elm-architecture>
-}
configElmArchitecture : List Rule
configElmArchitecture =
    [ NoMissingSubscriptionsCall.rule
    , NoRecursiveUpdate.rule
    , NoUselessSubscriptions.rule
    ]



{--
-------------------------------------------------
    main config
-------------------------------------------------
--}


config : List Rule
config =
    List.concat
        [ configUnused
        , configSimplify
        , configCommon
        , configPorts
        , configCamelCase
        , configImports
        , configElmArchitecture
        ]
