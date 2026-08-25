import math
import wave
import struct

SR = 44100

def generate_tip():
    duration = 2.5
    num_samples = int(duration * SR)
    samples = []
    
    phase = 0.0
    for i in range(num_samples):
        t = i / SR
        
        # Frequency
        if t <= 0.4:
            f = 587.33 * ((880 / 587.33) ** (t / 0.4))
        else:
            f = 880.0
            
        # Gain
        g = 0.15 * ((0.001 / 0.15) ** (t / 2.5))
        
        # Sine wave
        val = math.sin(phase) * g
        samples.append(val)
        
        phase += 2 * math.pi * f / SR
        
    save_wav("public/notification.wav", samples)


def generate_review():
    total_duration = 0.20 + 1.2
    num_samples = int(total_duration * SR)
    master = [0.0] * num_samples
    
    def add_tone(freq, start_time, duration, volume):
        start_sample = int(start_time * SR)
        end_sample = int((start_time + duration) * SR)
        phase = 0.0
        
        for i in range(start_sample, end_sample):
            if i >= num_samples:
                break
            t = i / SR
            
            # Envelope
            if t <= start_time + 0.05:
                g = 0.001 + (volume - 0.001) * (t - start_time) / 0.05
            else:
                ramp_dur = duration - 0.05
                if ramp_dur <= 0:
                    g = 0.001
                else:
                    g = volume * ((0.001 / volume) ** ((t - (start_time + 0.05)) / ramp_dur))
            
            # Triangle wave: 2 * abs(2 * phase - 1) - 1
            val = (2 * abs(2 * phase - 1) - 1) * g
            master[i] += val
            
            phase = (phase + freq / SR) % 1.0

    add_tone(523.25, 0.0, 0.4, 0.1)
    add_tone(659.25, 0.08, 0.4, 0.1)
    add_tone(783.99, 0.16, 0.8, 0.15)
    add_tone(1046.50, 0.20, 1.2, 0.12)
    
    save_wav("public/notification-review.wav", master)

def save_wav(filename, samples):
    # Normalize if needed, but here we just clamp to [-1, 1] and convert to 16-bit
    with wave.open(filename, 'w') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        
        for s in samples:
            # clamp
            s = max(-1.0, min(1.0, s))
            val = int(s * 32767.0)
            data = struct.pack('<h', val)
            w.writeframesraw(data)

if __name__ == "__main__":
    generate_tip()
    generate_review()
