# Video Hosting Cost Analysis

This document provides a comparative cost analysis for hosting Zoom recordings on various platforms, based on your specific requirements.

## 1. Projected Usage Data

Based on your input (6 lectures daily, 2 hours each), here is the expected data size and streaming usage.

**Assumptions:**
- **Working Days:** ~22 days per month.
- **File Size:** A compressed 2-hour Zoom recording (720p/1080p screen share) is roughly **600 MB (0.6 GB)**.
- **Student Viewership:** For bandwidth calculations, we assume **50 active students** watching an average of 2 hours of video per day.

| Metric | Daily | Monthly (22 Days) | Yearly |
| :--- | :--- | :--- | :--- |
| **Videos Uploaded** | 6 videos | 132 videos | 1,584 videos |
| **Video Duration** | 12 hours (720 mins) | 264 hours (15,840 mins) | 3,168 hours |
| **Upload Size (Storage)** | ~3.6 GB | **~80 GB** | ~960 GB (~1 TB) |
| **Bandwidth (Streaming)** | ~30 GB | **~660 GB** | ~7,920 GB (~8 TB) |

> [!IMPORTANT]
> **Bandwidth vs. Storage:** Storage costs are cumulative (you pay for all videos stored over time). Bandwidth costs are based on how much your students watch in a given month. For video platforms, **bandwidth is usually the most expensive factor.**

---

## 2. Platform Cost Comparison

Here is the estimated **Monthly Cost** for the first few months of operation.

### Option 1: Supabase (Pro Tier)
Using your existing database infrastructure to store raw `.mp4` files.
- **Storage:** 100 GB included. $0.021 per extra GB.
- **Bandwidth:** 250 GB included. $0.09 per extra GB.
- **Cost Breakdown (Month 1):**
  - Base fee: $25
  - Storage (80 GB): $0 extra
  - Bandwidth (660 GB): 410 GB extra × $0.09 = $36.90 extra
- **Estimated Total:** **~$62 / month**
> [!WARNING]
> While convenient, serving raw MP4 files from a database is not optimized for streaming. Students with slow internet will experience buffering. Also, as your video library grows, the storage and bandwidth costs will scale quickly.

### Option 2: Bunny.net (Bunny Stream) 🏆 Highly Recommended
A dedicated, developer-friendly video streaming CDN that automatically encodes videos for smooth playback (HLS).
- **Storage:** $0.01 per GB.
- **Bandwidth:** ~$0.01 per GB.
- **Cost Breakdown (Month 1):**
  - Base fee: $0 (pay as you go)
  - Storage (80 GB): $0.80
  - Bandwidth (660 GB): $6.60
- **Estimated Total:** **~$7.50 / month**
> [!TIP]
> Bunny.net is the industry favorite for custom e-learning platforms. It is incredibly cheap, optimizes video quality for the student's internet speed, and offers advanced security (Domain restriction + DRM to prevent downloading).

### Option 3: YouTube (Unlisted)
Using YouTube to host the videos and embedding the links in your platform.
- **Storage:** Unlimited
- **Bandwidth:** Unlimited
- **Estimated Total:** **$0 (Free)**
> [!CAUTION]
> While free, YouTube videos can be shared easily if a student copies the "Unlisted" link. You also cannot remove the YouTube branding/suggested videos at the end, which may feel less professional.

### Option 4: Amazon Web Services (S3 + CloudFront)
The enterprise standard for raw cloud hosting.
- **Storage:** $0.023 per GB.
- **Bandwidth:** $0.085 per GB.
- **Cost Breakdown (Month 1):**
  - Storage (80 GB): $1.84
  - Bandwidth (660 GB): $56.10
- **Estimated Total:** **~$58 / month**

### Option 5: Cloudflare Stream / Mux
Premium video APIs designed for massive, dynamic streaming apps (like Twitch or TikTok). They charge by the *minute* rather than by the Gigabyte.
- **Cost:** ~$5 per 1,000 minutes stored + $1 per 1,000 minutes viewed.
- **Cost Breakdown (Month 1):**
  - Storage (15,840 mins): ~$79
  - Streaming (132,000 mins): ~$132
- **Estimated Total:** **~$211 / month**
> [!NOTE]
> These platforms are overkill and far too expensive for archiving 2-hour long educational lectures.

---

## 3. Conclusion & Recommendation

1. If you want the **absolute lowest cost** and don't mind a slight loss in privacy/branding, use **YouTube (Unlisted)**. It will cost you $0.
2. If you want a **professional, secure, buffering-free** experience that integrates perfectly into your custom platform, use **Bunny.net (Bunny Stream)**. It will cost you less than $10 a month to start, and ensures students cannot download or share your premium content.

**Do not use Supabase** for hosting the actual video files. Supabase is excellent for database records (e.g., storing the *URL* of the video, the batch ID, the title, etc.), but it is not built or priced to be a video streaming server.
