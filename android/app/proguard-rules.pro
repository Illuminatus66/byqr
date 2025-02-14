# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
-dontwarn com.google.common.logging.Vr$VREvent$Cyclops$Share$Type
-dontwarn com.google.common.logging.Vr$VREvent$Eva$CameraFirmwareUpdate$UpdateOutcome
-dontwarn com.google.common.logging.Vr$VREvent$Eva$ExportMedia$Type
-dontwarn com.google.common.logging.Vr$VREvent$Eva$FileTransfer$FileType
-dontwarn com.google.common.logging.Vr$VREvent$Eva$FileTransfer$Outcome
-dontwarn com.google.common.logging.Vr$VREvent$Eva$FileTransfer$TransferInterface
-dontwarn com.google.common.logging.Vr$VREvent$Eva$Pairing$Outcome
-dontwarn com.google.common.logging.Vr$VREvent$Eva$SelectionAction$ActionEntryPoint
-dontwarn com.google.common.logging.Vr$VREvent$Eva$SelectionAction$ActionOutcome
-dontwarn com.google.common.logging.Vr$VREvent$Eva$View$MediaType
-dontwarn com.google.common.logging.Vr$VREvent$Eva$View$TriggerAction
-dontwarn com.google.common.logging.Vr$VREvent$Eva$View$ViewSource
-dontwarn com.google.common.logging.Vr$VREvent$Eva$View$ViewType
-dontwarn com.google.common.logging.Vr$VREvent$Eva$WigglegramGeneration$Status
-dontwarn com.google.common.logging.Vr$VREvent$Vr180Creator$VideoQuality
-dontwarn com.google.protobuf.CodedOutputStream
-dontwarn com.google.protobuf.GeneratedMessageLite
-dontwarn com.google.protobuf.MessageLite
-dontwarn com.google.protobuf.Parser
-dontwarn com.google.protobuf.nano.NanoEnumValue
-dontwarn logs.proto.wireless.performance.mobile.MemoryMetric$AndroidMemoryStats

-keep class com.google.common.logging.** { *; }
-keep class com.google.protobuf.** { *; }
-keep class logs.proto.wireless.performance.** { *; }